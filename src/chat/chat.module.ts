import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import ChatEntity from './chat.entity';
import MessageEntity from './message.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [TypeOrmModule.forFeature([ChatEntity, MessageEntity]), AuthModule],
  controllers: [ChatController],
})
export class ChatModule {}
