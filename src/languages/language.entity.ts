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
class Language {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  @Index()
  public name: string;

  @Column()
  @Index()
  public code: string;

  @ManyToMany(() => HeroEntity, (hero) => hero.languages)
  heroes: HeroEntity[];

  @ManyToMany(() => HelpRequestEntity, (helpRequest) => helpRequest.categories)
  helpRequests: HelpRequestEntity[];
}

export default Language;
