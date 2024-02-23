import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './schemas/chat.schema';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf, Context } from 'telegraf';
import { ChatDto } from './dto/chat.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatsModel: Model<Chat>,
    @InjectBot() private bot: Telegraf<Context>
  ) {}

  private static removedChats = [];

  async updateChatData(data: Omit<Chat, 'authorized'>) {
    const { id, status } = data;
    // ignore first leave event from recently deleted chat
    if (status === 'left' && ChatsService.removedChats.includes(id)) {
      ChatsService.removedChats = ChatsService.removedChats.filter(item => item !== id);
      return;
    }
    await this.chatsModel.updateOne({ id: data.id }, { $set: data }, { upsert: true });
  }

  async getAdminChats(userId: number) {
    const chats = await this.chatsModel.find({ status: { $not: { $in: ['left', 'kicked'] } } });
    const result: ChatDto[] = [];

    for (const { id, title } of chats) {
      const { status } = await this.bot.telegram.getChatMember(id, userId);
      if (status === 'creator' || status === 'administrator') {
        result.push({ id, title });
      }
    }

    return result;
  }
}
