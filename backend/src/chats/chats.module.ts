import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { Chat, ChatsSchema } from './schemas/chat.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatsController } from './chats.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Chat.name, schema: ChatsSchema }])],
  providers: [ChatsService],
  exports: [ChatsService],
  controllers: [ChatsController],
})
export class ChatsModule {}
