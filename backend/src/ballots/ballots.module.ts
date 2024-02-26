import { Module } from '@nestjs/common';
import { BallotsService } from './ballots.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Ballot, BallotsSchema } from './schemas/ballots.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ballot.name, schema: BallotsSchema }])],
  providers: [BallotsService],
  exports: [BallotsService],
})
export class BallotsModule {}
