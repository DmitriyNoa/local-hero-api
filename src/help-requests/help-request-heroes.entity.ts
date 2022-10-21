import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import HeroEntity from '../heroes/hero.entity';
import HelpRequestEntity from './help-request.entity';

@Entity({ name: 'help_requests_heroes' })
class HelpRequestHeroEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => HelpRequestEntity, (helpRequest) => helpRequest.heroes)
  helpRequests: HelpRequestEntity;

  @ManyToOne(() => HeroEntity, (hero) => hero.helpRequests)
  heroes: HeroEntity;

  @Column({ nullable: true })
  public status: string;
}

export default HelpRequestHeroEntity;
