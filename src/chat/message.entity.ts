import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import UserEntity from '../users/user.entity';
import ChatEntity from './chat.entity';

@Entity('messages')
class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ nullable: true })
  public parentId: string;

  @Column({ nullable: true })
  public text: string;

  @Column({ nullable: true })
  public status: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages)
  @JoinColumn()
  chat: ChatEntity;
}

export default MessageEntity;
