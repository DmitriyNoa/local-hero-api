import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany, OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import ChatEntity from '../chat/chat.entity';
import ChatToUsersEntity from "../chat/chat-users.entity";
import ReviewEntity from "../reviews/review.entity";

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

  @OneToMany(() => ChatToUsersEntity, (chatToUsers) => chatToUsers.user)
  chatsToUsers: ChatToUsersEntity[];

  @ManyToMany(() => ReviewEntity, (review) => review.user)
  @JoinTable()
  reviews: ReviewEntity[];
}

export default User;
