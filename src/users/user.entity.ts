import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Coordinates } from '../help-requests/help-requests.service';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public username: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public latitude: string;

  @Column()
  public longitude: string;

  @Column()
  public radius: number;

  @Column()
  public rank: number;

  @Column()
  public avatar: string;

  @Column()
  public status: number;

  @Column()
  public type: string;

  @Column()
  public password: string;
}

export default User;
