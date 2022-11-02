import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import HeroEntity from '../heroes/hero.entity';
import HelpRequestEntity from './help-request.entity';

@Entity({ name: 'help_requests_heroes' })
class HelpRequestHeroEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(
    () => HelpRequestEntity,
    (helpRequest) => helpRequest.heroHelpRequests,
  )
  helpRequest: HelpRequestEntity;

  @ManyToOne(() => HeroEntity, (hero) => hero.heroHelpRequests)
  hero: HeroEntity;

  @Column({ nullable: true })
  public status: string;
}

export default HelpRequestHeroEntity;
