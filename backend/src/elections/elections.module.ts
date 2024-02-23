import { Module } from '@nestjs/common';
import { ElectionsService } from './elections.service';
import { ElectionsController } from './elections.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Elections, ElectionsSchema } from './schemas/elections.schema';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Elections.name, schema: ElectionsSchema }]), ChatsModule],
  providers: [ElectionsService],
  controllers: [ElectionsController],
})
export class ElectionsModule {}
