import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import HelpRequestHeroesEntity from '../help-requests/help-request-heroes.entity';
import { HelpRequestsService } from '../help-requests/help-requests.service';
import { HeroesService } from './heroes.service';

@Injectable()
export class HeroesHelpRequestService extends TypeOrmCrudService<HelpRequestHeroesEntity> {
  constructor(
    @InjectRepository(HelpRequestHeroesEntity)
    repo: Repository<HelpRequestHeroesEntity>,
    private helpRequestService: HelpRequestsService,
    private heroService: HeroesService,
  ) {
    super(repo);
  }

  async requestHeroHelp(heroId: string, helpRequestId: string) {
    const hero = await this.heroService.findOne({ where: { id: heroId } });

    if (!hero) {
      throw new NotFoundException('Hero not found');
    }

    const helpRequest = await this.helpRequestService.findOne({
      where: { id: helpRequestId },
    });

    if (!helpRequest) {
      throw new NotFoundException('Help request not found');
    }

    const heroHelpRequest = new HelpRequestHeroesEntity();
    heroHelpRequest.heroes = hero;
    heroHelpRequest.helpRequests = helpRequest;
    heroHelpRequest.status = 'pending';

    const createdHeroHelpRequest = await this.repo.save(heroHelpRequest);

    return createdHeroHelpRequest;
  }

  async updateHeroHelp(
    helpRequestId: string,
    status: 'pending' | 'rejected' | 'accepted',
  ) {
    await this.repo.update({ id: helpRequestId }, { status });

    return { helpRequestId, status };
  }

  async getHeroHelpRequests(id: string) {
    const hero = await this.heroService.findOne({ where: { id } });

    // For some reason find fails if location is present
    // TODO: Investigate why
    const { location, ...resetHero } = hero;

    return this.repo.find({
      where: { heroes: resetHero },
      relations: ['helpRequests', 'helpRequests.requestUser'],
    });
  }
}
