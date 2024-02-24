import { Module } from '@nestjs/common';
import { ElectionsService } from './elections.service';
import { ElectionsController } from './elections.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Elections, ElectionsSchema } from './schemas/elections.schema';
import { ChatsModule } from 'src/chats/chats.module';
import { CandidatesModule } from 'src/candidates/candidates.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Elections.name, schema: ElectionsSchema }]),
    ChatsModule,
    CandidatesModule,
  ],
  providers: [ElectionsService],
  controllers: [ElectionsController],
})
export class ElectionsModule {}
