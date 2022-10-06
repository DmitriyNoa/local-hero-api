import {
  Column,
  Entity,
  Index,
  JoinTable, ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Point } from 'geojson';
import UserEntity from '../users/user.entity';
import Category from "../categories/category.entity";
import LanguageEntity from "../languages/language.entity";

@Entity({ name: 'help_requests' })
class HelpRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Index({})
  @JoinTable()
  @ManyToOne(() => UserEntity)
  requestUser!: UserEntity;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point;

  @Column({ nullable: true })
  public locationMeta: string;

  @Column({ nullable: true })
  public title: string;

  @Column({ nullable: true })
  public radius: number;

  @Column({ type: 'timestamp', nullable: true })
  activeAt!: Date;

  @Column({ nullable: true })
  dateType: string;

  @Column({ nullable: true })
  public status: number;

  @Column({ nullable: true })
  public type: string;

  @Column({ nullable: true })
  public description: string;

  @ManyToMany(() => Category, (category) => category.heroes)
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => LanguageEntity, (language) => language.heroes)
  @JoinTable()
  languages: LanguageEntity[];
}

export default HelpRequestEntity;
