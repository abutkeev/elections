import { Injectable } from '@nestjs/common';
import { Update as UpdateNamespace } from '@telegraf/types/update';
import { Ctx, On, Start, Update } from 'nestjs-telegraf';
import { ChatsService } from 'src/chats/chats.service';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class TgBotService {
  constructor(private chatsService: ChatsService) {}
  @Start()
  async start(@Ctx() ctx: Context) {
    const { type } = ctx.chat;

    if (type !== 'group' && type !== 'supergroup') {
      await ctx.reply('Welcome');
      return;
    }

    const { id, title } = ctx.chat;

    const { status } = await ctx.getChatMember(ctx.botInfo.id);
    this.chatsService.updateChatData({ id, type, title, status });
    await ctx.reply('chat info updated');
  }

  @On('my_chat_member')
  async saveChat(@Ctx() ctx: Context<UpdateNamespace.MyChatMemberUpdate>) {
    const { type } = ctx.chat;

    if (type !== 'group' && type !== 'supergroup') return;

    const { id, title } = ctx.chat;
    const { status } = ctx.update.my_chat_member.new_chat_member;
    this.chatsService.updateChatData({ id, type, title, status });
  }
}
