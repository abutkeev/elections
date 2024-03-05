import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ballot } from './schemas/ballots.schema';
import { Model } from 'mongoose';

@Injectable()
export class BallotsService {
  constructor(@InjectModel(Ballot.name) private model: Model<Ballot>) {}

  async get(user_id: number, elections_id: string) {
    const ballot = await this.model.findOne({ user_id, elections_id }).exec();

    if (!ballot) return undefined;

    return ballot.toJSON();
  }

  async vote(user_id: number, elections_id: string, vote: number[]) {
    await this.model.updateOne({ user_id, elections_id }, { user_id, elections_id, vote }, { upsert: true });
  }

  async getVotes(elections_id: string): Promise<number[][] | undefined> {
    const votes = await this.model.find({ elections_id }).exec();

    if (!votes || votes.length === 0) {
      return undefined;
    }

    return votes.map(({ vote }) => vote);
  }
}
