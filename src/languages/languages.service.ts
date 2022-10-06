import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';
import LanguageEntity from './language.entity';

@Injectable()
export class LanguagesService extends TypeOrmCrudService<LanguageEntity> {
  constructor(
    @InjectRepository(LanguageEntity) repo: Repository<LanguageEntity>,
  ) {
    super(repo);
  }

  createOne(
    req: CrudRequest,
    dto: DeepPartial<LanguageEntity>,
  ): Promise<LanguageEntity> {
    return super.createOne(req, dto);
  }

  getMany(
    req: CrudRequest,
  ): Promise<GetManyDefaultResponse<LanguageEntity> | LanguageEntity[]> {
    return super.getMany(req);
  }

  findByIds(ids: string[]): Promise<LanguageEntity[]> {
    return this.repo.findBy({ id: In(ids) });
  }
}
