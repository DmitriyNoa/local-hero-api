import { forwardRef, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import ChatEntity from './chat.entity';
import MessageEntity from './message.entity';
import { AuthModule } from '../auth/auth.module';
import ChatToUsersEntity from './chat-users.entity';
import { UsersModule } from '../users/users.module';
import { MessageService } from './message.service';

@Module({
  providers: [ChatGateway, ChatService, MessageService],
  imports: [
    TypeOrmModule.forFeature([ChatEntity, MessageEntity, ChatToUsersEntity]),
    AuthModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [ChatController],
  exports: [ChatService, MessageService],
})
export class ChatModule {}
