import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { DB_URI, TELEGRAM_BOT_TOKEN } from './constants';
import { TgBotModule } from './tg-bot/tg-bot.module';
import { ChatsModule } from './chats/chats.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ElectionsModule } from './elections/elections.module';
import { CandidatesModule } from './candidates/candidates.module';
import { BallotsModule } from './ballots/ballots.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot(DB_URI),
    TelegrafModule.forRoot({
      token: TELEGRAM_BOT_TOKEN,
    }),
    TgBotModule,
    ChatsModule,
    ElectionsModule,
    CandidatesModule,
    BallotsModule,
    EventsModule,
  ],
})
export class AppModule {}
