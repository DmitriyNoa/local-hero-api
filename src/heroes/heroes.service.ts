import { Injectable } from '@nestjs/common';
import HeroEntity from './hero.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';
import { LanguagesService } from '../languages/languages.service';
import HeroDTO from './hero.dto';

@Injectable()
export class HeroesService extends TypeOrmCrudService<HeroEntity> {
  constructor(
    @InjectRepository(HeroEntity) repo: Repository<HeroEntity>,
    private userService: UsersService,
    private categoriesService: CategoriesService,
    private languagesService: LanguagesService,
  ) {
    super(repo);
  }

  async createHero(heroDTO: HeroDTO, request: any) {
    const userId = request.user.id;
    const user = await this.userService.findOneOrFail(userId);
    const hero = new HeroEntity();

    hero.name = heroDTO.name;
    hero.user = user;
    hero.description = heroDTO.description;

    if (heroDTO.categories && heroDTO.categories.length > 0) {
      const categories = await this.categoriesService.findByIds(
        heroDTO.categories,
      );

      if (categories && categories.length) {
        hero.categories = categories;
      }
    }

    if (heroDTO.languages && heroDTO.languages.length > 0) {
      const languages = await this.languagesService.findByIds(
        heroDTO.languages,
      );

      if (languages && languages.length > 0) {
        hero.languages = languages;
      }
    }

    const savedHero = await this.repo.save(hero);

    return savedHero;
  }
}
