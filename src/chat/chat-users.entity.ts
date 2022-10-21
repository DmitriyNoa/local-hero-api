import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import UserEntity from '../users/user.entity';
import ChatEntity from './chat.entity';

@Entity('chats_users')
class ChatToUsersEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: true })
  public role!: string;

  @Column({ nullable: true })
  public status!: string;

  @Column()
  public userId!: string;

  @Column()
  public chatId!: string;

  @ManyToOne(() => UserEntity, (user) => user.chatsToUsers)
  user!: UserEntity;

  @ManyToOne(() => ChatEntity, (chat) => chat.chatsToUsers)
  chat!: ChatEntity;
}

export default ChatToUsersEntity;
