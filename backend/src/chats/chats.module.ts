import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Chat, ChatsSchema } from './schemas/chat.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatsSchema }])],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
