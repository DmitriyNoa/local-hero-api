import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from 'geojson';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public username: string;

  @Column({ nullable: true })
  public firstName: string;

  @Column({ nullable: true })
  public lastName: string;

  @Column({ type: 'decimal', nullable: true })
  public latitude: number;

  @Column({ type: 'decimal', nullable: true })
  public longitude: number;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;

  @Column({ nullable: true })
  public radius: number;

  @Column({ default: 0 })
  public rank: number;

  @Column({ nullable: true })
  public avatar: string;

  @Column({ nullable: true })
  public status: number;

  @Column( { nullable: true } )
  public type: string;

  @Column()
  public password: string;
}

export default User;
