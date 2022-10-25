import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Category from '../categories/category.entity';
import LanguageEntity from '../languages/language.entity';
import UserEntity from '../users/user.entity';
import { Point } from 'geojson';
import HelpRequestHeroesEntity from '../help-requests/help-request-heroes.entity';

@Entity()
class Hero {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToMany(() => Category, (category) => category.heroes)
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => LanguageEntity, (language) => language.heroes)
  @JoinTable()
  languages: LanguageEntity[];

  @OneToOne(() => UserEntity)
  @JoinColumn()
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

  @OneToMany(() => HelpRequestHeroesEntity, (helpRequest) => helpRequest.hero)
  heroHelpRequests: HelpRequestHeroesEntity[];
}

export default Hero;
