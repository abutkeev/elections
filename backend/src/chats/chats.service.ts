import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getUserStatus(userId: number, chatId: number): Promise<'member' | 'admin' | undefined> {
    try {
      const { status } = await this.bot.telegram.getChatMember(chatId, userId);
      switch (status) {
        case 'creator':
        case 'administrator':
          return 'admin';
        case 'kicked':
        case 'left':
          return;
        default:
          return 'member';
      }
    } catch (e) {
      if (e instanceof Error && e.message === '400: Bad Request: group chat was upgraded to a supergroup chat') {
        this.chatsModel.deleteOne({ id: chatId }).exec();
        return;
      }
      return;
    }
  }

  async getChat(id: number) {
    const chat = await this.chatsModel.findOne({ id });
    if (!chat) {
      throw new NotFoundException(`chat ${id} not found`);
    }
    return chat.toJSON();
  }

  async getAdminChats(userId: number) {
    const chats = await this.chatsModel.find({ status: { $not: { $in: ['left', 'kicked'] } } });
    const result: ChatDto[] = [];

    for (const { id, title } of chats) {
      const status = await this.getUserStatus(userId, id);
      if (status === 'admin') {
        result.push({ id, title });
      }
    }

    return result;
  }
}
