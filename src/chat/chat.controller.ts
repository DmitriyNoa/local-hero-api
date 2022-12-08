import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageService } from './message.service';
import { AuthenticationGuard } from '../auth/jwt-auth.guard';

@Controller('chats')
@UseGuards(AuthenticationGuard)
export class ChatController {
  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
  ) {}

  @Get('/:chatId')
  getChat(@Param('chatId') chatId) {
    return this.chatService.getChatByIdOrFail(chatId);
  }

  @Get('/:chatId/messages')
  getChatMessages(@Param('chatId') chatId) {
    console.log("getting messages", chatId);
    return this.messageService.getChatMessages(chatId);
  }
}
