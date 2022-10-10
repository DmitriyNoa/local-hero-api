import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '../auth/jwt-auth.guard';
import { HeroesService } from './heroes.service';

@Controller('closest-heroes')
@UseGuards(AuthenticationGuard)
export class HeroesSearchController {
  constructor(public service: HeroesService) {}

  @Get('/:locationString')
  getHeroesByLocation(@Param('locationString') locationString: string) {
    return this.service.getClosestHeroes(locationString);
  }
}
