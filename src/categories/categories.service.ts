import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import CategoryEntity from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';
import Category from './category.entity';

@Injectable()
export class CategoriesService extends TypeOrmCrudService<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity) repo: Repository<CategoryEntity>,
  ) {
    super(repo);
  }

  createOne(req: CrudRequest, dto: DeepPartial<Category>): Promise<Category> {
    return super.createOne(req, dto);
  }

  getMany(
    req: CrudRequest,
  ): Promise<GetManyDefaultResponse<Category> | Category[]> {
    return super.getMany(req);
  }
}
