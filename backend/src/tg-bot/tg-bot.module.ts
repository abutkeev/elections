import { Module } from '@nestjs/common';
import { TgBotService } from './tg-bot.service';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [ChatsModule],
  providers: [TgBotService],
})
export class TgBotModule {}
