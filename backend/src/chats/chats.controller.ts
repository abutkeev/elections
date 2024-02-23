import { Controller, Get, Request } from '@nestjs/common';
import { ChatsService } from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private service: ChatsService) {}

  @Get()
  async get(@Request() { user }) {
    return this.service.getAdminChats(user.id);
  }
}
