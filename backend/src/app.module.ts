import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TelegrafModule } from 'nestjs-telegraf';
import { DB_URI, TELEGRAM_BOT_TOKEN } from './constants';
import { TgBotModule } from './tg-bot/tg-bot.module';
import { ChatsModule } from './chats/chats.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ElectionsModule } from './elections/elections.module';

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
  ],
})
export class AppModule {}
