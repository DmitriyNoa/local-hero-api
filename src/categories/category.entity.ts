import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import HeroEntity from '../heroes/hero.entity';
import HelpRequestEntity from '../help-requests/help-request.entity';

@Entity()
class Category {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ unique: true })
  @Index()
  public name: string;

  @Column({ nullable: true })
  @Index()
  public parentId: string;

  @ManyToMany(() => HeroEntity, (hero) => hero.categories)
  heroes: HeroEntity[];

  @ManyToMany(() => HelpRequestEntity, (helpRequest) => helpRequest.categories)
  helpRequests: HelpRequestEntity[];
}

export default Category;
