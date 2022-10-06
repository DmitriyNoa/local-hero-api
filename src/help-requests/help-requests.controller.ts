import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Coordinates, HelpRequestsService } from './help-requests.service';
import HelpRequestEntity from './help-request.entity';
import HelpRequestDTO from './help-request.dto';
import { AuthenticationGuard } from '../auth/jwt-auth.guard';
import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';

@Crud({
  model: {
    type: HelpRequestEntity,
  },
  params: {
    id: {
      type: 'string',
      primary: true,
      field: 'id',
    },
  },
})
@Controller('/help-requests')
export class HelpRequestsController
  implements CrudController<HelpRequestEntity>
{
  constructor(public service: HelpRequestsService) {}

  @UseGuards(AuthenticationGuard)
  @Override()
  createOne(
    @ParsedBody() helpDTO: HelpRequestDTO,
    @ParsedRequest() crudRequest: CrudRequest,
    @Req() request: any,
  ): Promise<HelpRequestEntity> {
    const { id } = request.user;
    return this.service.createHelpRequest(helpDTO, id);
  }
}
