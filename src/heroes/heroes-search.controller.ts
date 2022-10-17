import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '../auth/jwt-auth.guard';
import { HeroesService } from './heroes.service';

@Controller('closest-heroes')
@UseGuards(AuthenticationGuard)
export class HeroesSearchController {
  constructor(public service: HeroesService) {}

  @Get('/help-request/:requestId/heroes')
  getHeroesByHelpRequestID(@Param('requestId') helpRequestID: string) {
    return this.service.getHeroesByHelpRequestID(helpRequestID);
  }
}
