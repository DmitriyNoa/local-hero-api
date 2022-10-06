import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Category from '../categories/category.entity';
import LanguageEntity from '../languages/language.entity';
import UserEntity from '../users/user.entity';
import { Point } from 'geojson';

@Entity()
class Hero {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  @Index()
  public name: string;

  @ManyToMany(() => Category, (category) => category.heroes)
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => LanguageEntity, (language) => language.heroes)
  @JoinTable()
  languages: LanguageEntity[];

  @OneToOne(() => UserEntity)
  @JoinTable()
  user: UserEntity;

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

  @Column({ nullable: true })
  public locationDetails: string;

  @Column({ nullable: true })
  public description: string;
}

export default Hero;
