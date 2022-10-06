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
import CategoryEntity from './category.entity';
import { CategoriesService } from './categories.service';
import { AuthenticationGuard } from '../auth/jwt-auth.guard';
import Category from './category.entity';

@Crud({
  model: {
    type: CategoryEntity,
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
@Controller('categories')
export class CategoriesController implements CrudController<CategoryEntity> {
  constructor(public service: CategoriesService) {}

  @Override()
  createOne(
    @ParsedBody() categoryDTO: CategoryEntity,
    @ParsedRequest() crudRequest: CrudRequest,
    @Req() request: any,
  ): Promise<CategoryEntity> {
    return this.service.createOne(crudRequest, categoryDTO);
  }

  getManyBase(
    req: CrudRequest,
  ): Promise<GetManyDefaultResponse<Category> | Category[]> {
    return this.service.getMany(req);
  }
}
