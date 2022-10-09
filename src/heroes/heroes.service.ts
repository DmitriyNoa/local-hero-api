import { Injectable } from '@nestjs/common';
import HeroEntity from './hero.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';
import { LanguagesService } from '../languages/languages.service';
import HeroDTO from './hero.dto';
import { Point } from 'geojson';

@Injectable()
export class HeroesService extends TypeOrmCrudService<HeroEntity> {
  constructor(
    @InjectRepository(HeroEntity) repo: Repository<HeroEntity>,
    private userService: UsersService,
    private categoriesService: CategoriesService,
    private languagesService: LanguagesService
  ) {
    super(repo);
  }

  async getHero(request: any) {
    const userId = request.user.id;
    const user = await this.userService.findOneOrFail(userId);
    const hero = await this.repo.findOne({ where: user });

    return hero;
  }

  async createHero(heroDTO: HeroDTO, request: any) {
    const userId = request.user.id;
    // Find a user to associate with the hero
    const user = await this.userService.findOneOrFail(userId);
    const hero = new HeroEntity();

    hero.user = user;
    hero.description = heroDTO.description;

    // If hero categories are provided - find categories in the DB and save to hero
    if (heroDTO.categories && heroDTO.categories.length > 0) {
      const categories = await this.categoriesService.findByIds(
        heroDTO.categories,
      );

      if (categories && categories.length) {
        hero.categories = categories;
      }
    }

    // If hero languages are provided - find languages in the DB and save to hero
    if (heroDTO.languages && heroDTO.languages.length > 0) {
      const languages = await this.languagesService.findByIds(
        heroDTO.languages,
      );

      if (languages && languages.length > 0) {
        hero.languages = languages;
      }
    }

    // If hero location is provided create geometry object and save location
    if (heroDTO.location) {
      const pointObject: Point = {
        type: 'Point',
        coordinates: [
          heroDTO.location.details.geometry.location.lng,
          heroDTO.location.details.geometry.location.lat,
        ],
      };

      hero.location = pointObject;
      hero.locationDetails = heroDTO.location.data.description;
    }

    const savedHero = await this.repo.save(hero);

    await this.userService.updateUser(user.user_id, { type: 'Hero' });

    return savedHero;
  }
}
