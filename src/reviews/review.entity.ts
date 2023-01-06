import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import UserEntity from '../users/user.entity';

@Entity('reviews')
class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ nullable: true })
  public parentId: string;

  @Column({ nullable: true })
  public title: string;

  @Column({ nullable: true })
  public text: string;

  @Column({ type: 'float4', nullable: true })
  public rating: number;

  @ManyToOne(() => UserEntity, (user) => user.reviews)
  user: UserEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  reviewer: UserEntity;

  @CreateDateColumn()
  createdAt: Date; // Creation date

  @UpdateDateColumn()
  updatedAt: Date; // Last updated date

  @DeleteDateColumn()
  deletedAt: Date; // Deletion date
}

export default ReviewEntity;
