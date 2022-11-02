import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import HeroEntity from '../heroes/hero.entity';
import { HeroesService } from '../heroes/heroes.service';
import { Request } from 'express';
import { AuthenticationGuard } from '../auth/jwt-auth.guard';

@UseGuards(AuthenticationGuard)
@Controller('users')
export class UsersHeroController {
  constructor(private service: HeroesService) {}

  @Get('/:username/hero')
  getOne(@Req() request: Request): Promise<HeroEntity> {
    return this.service.getUserHero(request);
  }
}
