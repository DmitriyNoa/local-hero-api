import { Controller, Req, UseGuards } from '@nestjs/common';
import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import {
  AuthenticatedRequest,
  AuthenticationGuard,
} from '../auth/jwt-auth.guard';
import LanguageEntity from './language.entity';
import { LanguagesService } from './languages.service';

@Crud({
  model: {
    type: LanguageEntity,
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
@Controller('languages')
export class LanguagesController implements CrudController<LanguageEntity> {
  constructor(public service: LanguagesService) {}

  @Override()
  createOne(
    @ParsedBody() categoryDTO: LanguageEntity,
    @ParsedRequest() crudRequest: CrudRequest,
    @Req() request: AuthenticatedRequest,
  ): Promise<LanguageEntity> {
    return this.service.createOne(crudRequest, categoryDTO);
  }

  getManyBase(
    req: CrudRequest,
  ): Promise<GetManyDefaultResponse<LanguageEntity> | LanguageEntity[]> {
    return this.service.getMany(req);
  }
}
