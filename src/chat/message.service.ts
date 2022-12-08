import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import MessageEntity from './message.entity';
import { ChatService } from './chat.service';

@Injectable()
export class MessageService extends TypeOrmCrudService<MessageEntity> {
  constructor(
    @InjectRepository(MessageEntity) repo: Repository<MessageEntity>,
    private chatService: ChatService,
    private userService: UsersService,
  ) {
    super(repo);
  }

  async createMessage(message: string, userId: string, chatId: string) {
    const user = await this.userService.findOneOrFail(userId);
    const chat = await this.chatService.getChatByIdOrFail(chatId);

    const newMessage = new MessageEntity();
    newMessage.user = user;
    newMessage.chat = chat;
    newMessage.text = message;

    const saved = await this.repo.save(newMessage);

    return saved;
  }

  async getChatMessages(chatId: string) {
    const chat = await this.chatService.getChatByIdOrFail(chatId);

    console.log("getting messages", chat);

    // if any object with location object exists in query it fails with "invalid geometry" so have to remove it
    // investigate why. Removing help request for now as it includes geometry
    const { helpRequest, ...restFromChat } = chat;

    return this.repo.find({
      where: { chat: restFromChat },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }
}
