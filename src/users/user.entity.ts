import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

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
}

export default User;
