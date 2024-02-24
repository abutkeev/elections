import { Module } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Candidate, CandidatesSchema } from './schemas/candidates.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Candidate.name, schema: CandidatesSchema }])],
  providers: [CandidatesService],
  exports: [CandidatesService],
})
export class CandidatesModule {}
