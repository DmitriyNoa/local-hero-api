import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ChatEntity from './chat.entity';
import UserEntity from '../users/user.entity';
import HelpRequestEntity from '../help-requests/help-request.entity';
import ChatUsersEntity from './chat-users.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ChatService extends TypeOrmCrudService<ChatEntity> {
  constructor(
    @InjectRepository(ChatEntity) repo: Repository<ChatEntity>,
    @InjectRepository(ChatUsersEntity)
    private chatToUserRepo: Repository<ChatUsersEntity>,
    private userService: UsersService,
  ) {
    super(repo);
  }

  async createHelpRequestChat(
    chatUsers: UserEntity[],
    helpRequest: HelpRequestEntity,
  ) {
    const chat = new ChatEntity();
    chat.description = helpRequest.description;
    chat.helpRequest = helpRequest;

    const createdChat = await this.repo.save(chat);

    const chatToUser = new ChatUsersEntity();
    chatToUser.user = chatUsers[1];
    chatToUser.chat = chat;

    const chatToHero = new ChatUsersEntity();
    chatToHero.user = chatUsers[0];
    chatToHero.chat = chat;

    await this.chatToUserRepo.save(chatToUser);
    await this.chatToUserRepo.save(chatToHero);

    return createdChat;
  }

  async getChatByIdOrFail(id: string) {
    const chat = this.repo.findOne({
      where: { id },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  async getUserChats(username: string) {
    const user = await this.userService.findUserProfile(username);

    const chats = this.chatToUserRepo.find({
      where: { user },
      relations: ['chat', 'chat.helpRequest', 'chat.helpRequest.requestUser'],
    });

    return chats;
  }
}
