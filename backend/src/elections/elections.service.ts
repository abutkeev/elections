import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatsService } from 'src/chats/chats.service';
import { Elections } from './schemas/elections.schema';
import { Model } from 'mongoose';
import { NewElectionsDto } from './dto/new-elections.dto';
import { ElectionsDto } from './dto/elections.dto';

@Injectable()
export class ElectionsService {
  constructor(
    @InjectModel(Elections.name) private electionsModel: Model<Elections>,
    private chatsService: ChatsService
  ) {}

  private logger = new Logger('ElectionsService');

  async get(userId: number): Promise<ElectionsDto[]> {
    const elections = await this.electionsModel.find();
    const result: ElectionsDto[] = [];
    for (const { id, title, chat, start, end } of elections) {
      try {
        const status = await this.chatsService.getUserStatus(userId, chat);
        if (!status) continue;
        const chatInfo = this.chatsService.getChat(chat);
        result.push({
          id,
          title,
          chat_title: (await chatInfo).title,
          start: start?.toISOString(),
          end: end?.toISOString(),
          can_edit: status === 'admin',
        });
      } catch (e) {
        this.logger.error(e);
      }
    }
    return result;
  }

  async add(userId: number, { chat, title }: NewElectionsDto) {
    const status = await this.chatsService.getUserStatus(userId, chat);
    if (status !== 'admin') {
      throw new ForbiddenException(`invalid user status ${status}`);
    }
    await this.electionsModel.create({ chat, title });
    return true;
  }
}
