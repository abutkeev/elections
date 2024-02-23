import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatsService } from 'src/chats/chats.service';
import { Elections } from './schemas/elections.schema';
import { Model } from 'mongoose';
import { NewElectionsDto } from './dto/new-elections.dto';

@Injectable()
export class ElectionsService {
  constructor(
    @InjectModel(Elections.name) private electionsModel: Model<Elections>,
    private chatsService: ChatsService
  ) {}

  async add(userId: number, { chat, title }: NewElectionsDto) {
    const status = await this.chatsService.getUserStatus(userId, chat);
    if (status !== 'admin') {
      throw new ForbiddenException(`invalid user status ${status}`);
    }
    await this.electionsModel.create({ chat, title });
    return true;
  }
}
