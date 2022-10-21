import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import MessageEntity from './message.entity';
import HelpRequestEntity from '../help-requests/help-request.entity';
import ChatToUsersEntity from './chat-users.entity';

@Entity('chats')
class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ nullable: true })
  public description: string;

  @OneToMany(() => MessageEntity, (message) => message.chat)
  @JoinColumn()
  messages: MessageEntity[];

  @OneToOne(() => HelpRequestEntity)
  @JoinColumn()
  helpRequest: HelpRequestEntity;

  @OneToMany(() => ChatToUsersEntity, (chatToUsers) => chatToUsers.chat)
  chatsToUsers: ChatToUsersEntity[];
}

export default ChatEntity;
