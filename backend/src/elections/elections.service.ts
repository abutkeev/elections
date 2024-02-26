import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatsService } from 'src/chats/chats.service';
import { Elections } from './schemas/elections.schema';
import { Model } from 'mongoose';
import { NewElectionsDto } from './dto/new-elections.dto';
import { ElectionsDto } from './dto/elections.dto';
import { NominationDto } from './dto/nomination.dto';
import { CandidatesService } from 'src/candidates/candidates.service';
import { BallotsService } from 'src/ballots/ballots.service';

@Injectable()
export class ElectionsService {
  constructor(
    @InjectModel(Elections.name) private electionsModel: Model<Elections>,
    private candidatesService: CandidatesService,
    private ballotsService: BallotsService,
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
        const candidates = await this.candidatesService.find(id);
        const ballot = await this.ballotsService.get(userId, id);
        result.push({
          id,
          title,
          chat_id: chat,
          chat_title: (await chatInfo).title,
          start: start?.toISOString(),
          end: end?.toISOString(),
          can_edit: status === 'admin',
          candidates,
          vote: ballot?.vote,
        });
      } catch (e) {
        this.logger.error(e);
      }
    }
    return result;
  }

  private get_time(data: NewElectionsDto): { start?: Date; end?: Date } {
    try {
      const start = data.start && new Date(data.start);
      const end = data.end && new Date(data.end);
      if (start && end && end <= start) {
        throw new BadRequestException('start time must be greater than end time');
      }
      return { start, end };
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      this.logger.error(e);
      return {};
    }
  }

  async add(userId: number, data: NewElectionsDto) {
    const { chat, title } = data;
    const status = await this.chatsService.getUserStatus(userId, chat);
    if (status !== 'admin') {
      throw new ForbiddenException(`invalid user status ${status}`);
    }
    const { start, end } = this.get_time(data);
    await this.electionsModel.create({ chat, title, start, end });
    return true;
  }

  async edit(userId: number, electionsId: string, data: NewElectionsDto) {
    const { chat, title } = data;
    const status = await this.chatsService.getUserStatus(userId, chat);
    if (status !== 'admin') {
      throw new ForbiddenException(`invalid user status ${status}`);
    }
    const { start, end } = this.get_time(data);
    await this.electionsModel.updateOne({ _id: electionsId }, { chat, title, start, end });
    return true;
  }

  private async check_can_nominate(userId: number, electionsId: string) {
    const elections = await this.electionsModel.findOne({ _id: electionsId }).exec();

    if (!elections) {
      throw new NotFoundException(`elections ${electionsId} not found`);
    }

    const { chat, start } = elections;

    if (start && start < new Date()) {
      throw new NotAcceptableException('elections is already started');
    }

    const status = await this.chatsService.getUserStatus(userId, chat);

    if (!status) {
      throw new NotAcceptableException('user not in chat');
    }
  }

  async nominate(userId: number, electionsId: string, data: NominationDto) {
    await this.check_can_nominate(userId, electionsId);
    await this.candidatesService.nominate(userId, electionsId, data);
  }

  async withdraw(userId: number, electionsId: string) {
    await this.check_can_nominate(userId, electionsId);
    await this.candidatesService.withdraw(userId, electionsId);
  }
}
