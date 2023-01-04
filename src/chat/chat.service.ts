import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ChatEntity from './chat.entity';
import UserEntity from '../users/user.entity';
import ChatUsersEntity from './chat-users.entity';
import { UsersService } from '../users/users.service';
import HelpRequestHeroEntity from '../help-requests/help-request-heroes.entity';

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
    helpRequest: HelpRequestHeroEntity,
  ) {
    const chat = new ChatEntity();
    chat.description = helpRequest.helpRequest.description;
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
    const chat = await this.repo.findOne({
      where: { id },
      relations: [
        'helpRequest',
        'helpRequest.helpRequest',
        'helpRequest.hero',
        'helpRequest.hero.user',
      ],
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    return chat;
  }

  async getUserChats(username: string) {
    const user = await this.userService.findUserProfile(username);

    const chats = await this.repo.find({
      where: { chatsToUsers: { user } },
      relations: [
        'helpRequest',
        'helpRequest.helpRequest',
        'helpRequest.helpRequest.requestUser',
        'helpRequest.hero',
        'helpRequest.hero.user',
      ],
    });

    const chatUsers = chats.map((chat) => {
      return chat?.helpRequest?.helpRequest?.requestUser?.userId;
    });

    const users = await this.userService.getKCUsersByIDs(chatUsers);

    const chatsWithUsers = chats.map((chat) => {
      const usr = users.find(
        (user) =>
          user.userId === chat?.helpRequest?.helpRequest?.requestUser?.userId,
      );

      return {
        ...chat,
        user: {
          ...usr,
          ...chat?.helpRequest?.helpRequest?.requestUser,
        },
      };
    });

    return chatsWithUsers;
  }
}
