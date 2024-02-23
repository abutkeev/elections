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
      try {
        const { status } = await this.bot.telegram.getChatMember(id, userId);
        if (status === 'creator' || status === 'administrator') {
          result.push({ id, title });
        }
      } catch (e) {
        if (e instanceof Error && e.message === '400: Bad Request: group chat was upgraded to a supergroup chat') {
          this.chatsModel.deleteOne({ id }).exec();
          continue;
        }
        throw e;
      }
    }

    return result;
  }
}
