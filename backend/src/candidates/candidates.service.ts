import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Candidate } from './schemas/candidates.schema';
import { Model } from 'mongoose';
import { NominationDto } from 'src/elections/dto/nomination.dto';

@Injectable()
export class CandidatesService {
  constructor(@InjectModel(Candidate.name) private model: Model<Candidate>) {}

  async nominate(user_id: number, elections_id: string, { name, program }: NominationDto) {
    await this.model.replaceOne({ user_id, elections_id }, { user_id, elections_id, name, program }, { upsert: true });
  }
}
