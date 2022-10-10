import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '../auth/jwt-auth.guard';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import HeroEntity from './hero.entity';
import { HeroesService } from './heroes.service';
import HeroDTO from './hero.dto';
import { Request } from 'express';

@Crud({
  model: {
    type: HeroEntity,
  },
})
@UseGuards(AuthenticationGuard)
@Controller('heroes')
export class HeroesController {
  constructor(public service: HeroesService) {}

  get base(): CrudController<HeroEntity> {
    return this;
  }

  @Override()
  getOne(
    @ParsedBody() heroDTO: HeroDTO,
    @ParsedRequest() crudRequest: CrudRequest,
    @Req() request: Request,
  ): Promise<HeroEntity> {
    return this.service.getHero(request);
  }

  @Override()
  createOne(
    @ParsedBody() heroDTO: HeroDTO,
    @ParsedRequest() crudRequest: CrudRequest,
    @Req() request: any,
  ): Promise<HeroEntity> {
    return this.service.createHero(heroDTO, request);
  }
}
