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
import SchulzeElections from 'libs/schulze/schulze-elections';
import { ResultsDto } from './dto/results.dto';
import { ResultDto } from './dto/result.dto';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class ElectionsService {
  constructor(
    @InjectModel(Elections.name) private electionsModel: Model<Elections>,
    private eventsService: EventsService,
    private candidatesService: CandidatesService,
    private ballotsService: BallotsService,
    private chatsService: ChatsService
  ) {}

  private logger = new Logger('ElectionsService');

  private async get_results(id: string): Promise<ResultsDto | undefined> {
    const candidates = await this.candidatesService.find(id);
    const votes = await this.ballotsService.getVotes(id);

    if (!candidates?.length || !votes?.length) {
      return undefined;
    }

    const counter = new SchulzeElections(candidates, votes);

    const mapResults = ([user_id, result]: readonly [number, number]): ResultDto => ({ user_id, result });

    return {
      votes,
      schulze: counter.get_results().map(mapResults),
      firsts: counter.get_firsts().map(mapResults),
      lasts: counter.get_lasts().map(mapResults),
      top5: counter.get_five().map(mapResults),
      quorum: counter.get_quorum(),
    };
  }

  async get(userId: number): Promise<ElectionsDto[]> {
    const elections = await this.electionsModel.find();
    const result: ElectionsDto[] = [];
    for (const { id, title, chat, start, end } of elections) {
      try {
        const status = await this.chatsService.getUserStatus(userId, chat);
        if (!status) continue;
        const chatInfo = await this.chatsService.getChat(chat);
        const candidates = await this.candidatesService.find(id);
        const ballot = await this.ballotsService.get(userId, id);
        const results = await this.get_results(id);
        result.push({
          id,
          title,
          chat_id: chat,
          chat_title: chatInfo.title,
          start: start?.toISOString(),
          end: end?.toISOString(),
          can_edit: status === 'admin',
          candidates,
          vote: ballot?.vote,
          results,
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

  private async notifyConnectedMembers(chatId: number) {
    for (const userId of this.eventsService.getConnected()) {
      const status = await this.chatsService.getUserStatus(userId, chatId);
      if (!status) continue;
      this.eventsService.sendToUser({ userId, message: 'invalidate_tag', args: 'elections' });
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
    this.notifyConnectedMembers(chat);
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
    this.notifyConnectedMembers(chat);
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

  private async notifyElectionsMember(electionsId: string) {
    const { chat } = await this.electionsModel.findOne({ _id: electionsId }).exec();
    this.notifyConnectedMembers(chat);
  }

  async nominate(userId: number, electionsId: string, data: NominationDto) {
    await this.check_can_nominate(userId, electionsId);
    await this.candidatesService.nominate(userId, electionsId, data);
    this.notifyElectionsMember(electionsId);
  }

  async withdraw(userId: number, electionsId: string) {
    await this.check_can_nominate(userId, electionsId);
    await this.candidatesService.withdraw(userId, electionsId);
    this.notifyElectionsMember(electionsId);
  }

  async vote(userId: number, electionsId: string, data: number[]) {
    const elections = await this.electionsModel.findOne({ _id: electionsId }).exec();

    if (!elections) {
      throw new NotFoundException(`elections ${electionsId} not found`);
    }

    const { chat, start, end } = elections;

    if (start && start > new Date()) {
      throw new NotAcceptableException('elections is not started');
    }

    if (end && end < new Date()) {
      throw new NotAcceptableException('elections is already ended');
    }

    const status = await this.chatsService.getUserStatus(userId, chat);

    if (!status) {
      throw new NotAcceptableException('user not in chat');
    }

    await this.ballotsService.vote(userId, electionsId, data);
    this.notifyElectionsMember(electionsId);
    return true;
  }
}
