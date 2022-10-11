import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '../auth/jwt-auth.guard';
import { HeroesService } from './heroes.service';
import { Location } from './hero.dto';

@Controller('closest-heroes')
@UseGuards(AuthenticationGuard)
export class HeroesSearchController {
  constructor(public service: HeroesService) {}

  @Post()
  getHeroesByLocation(@Body() location: Location) {
    return this.service.getClosestHeroes(location);
  }
}
