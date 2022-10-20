import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import UserEntity from '../users/user.entity';
import MessageEntity from './message.entity';

@Entity('chats')
class ChatEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ nullable: true })
  public description: string;

  @ManyToMany(() => UserEntity, (user) => user.chats)
  @JoinTable()
  users: UserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.chat)
  @JoinColumn()
  messages: MessageEntity[];
}

export default ChatEntity;
