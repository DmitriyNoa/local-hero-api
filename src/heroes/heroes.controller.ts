import { Controller, Req, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from '../auth/jwt-auth.guard';
import {
  Crud,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import HeroEntity from './hero.entity';
import { HeroesService } from './heroes.service';
import HeroDTO from "./hero.dto";

@Crud({
  model: {
    type: HeroEntity,
  },
  params: {
    id: {
      type: 'string',
      primary: true,
      field: 'id',
    },
  },
})
@UseGuards(AuthenticationGuard)
@Controller('heroes')
export class HeroesController {
  constructor(public service: HeroesService) {}

  @Override()
  createOne(
    @ParsedBody() heroDTO: HeroDTO,
    @ParsedRequest() crudRequest: CrudRequest,
    @Req() request: any,
  ): Promise<HeroEntity> {
    return this.service.createHero(heroDTO, request);
  }
}
