import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ChatEntity from '../chat/chat.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  @Index()
  public userId: string;

  @Column({ default: 0 })
  public rank: number;

  @Column({ nullable: true })
  public avatar: string;

  @Column({ nullable: true })
  public status: number;

  @Column({ nullable: true })
  public type: string;

  @Column({ nullable: true })
  public description: string;

  @Column({ nullable: true })
  public city: string;

  @ManyToMany(() => ChatEntity, (chat) => chat.users)
  @JoinTable()
  chats: ChatEntity[];
}

export default User;
