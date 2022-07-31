import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { Point } from 'geojson';

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

  @Column({ type: 'decimal' })
  public latitude: number;

  @Column({ type: 'decimal' })
  public longitude: number;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;

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
