import { Injectable } from '@nestjs/common';
import HeroEntity from './hero.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';
import { LanguagesService } from '../languages/languages.service';
import HeroDTO from './hero.dto';
import { Point } from 'geojson';
import { getDistance } from 'geolib';

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

      // Find northeast location radius
      const radiusNortheast = getDistance(
        {
          lat: heroDTO.location.details.geometry.location.lat,
          lng: heroDTO.location.details.geometry.location.lng,
        },
        {
          lat: heroDTO.location.details.geometry.viewport.northeast.lat,
          lng: heroDTO.location.details.geometry.viewport.northeast.lng,
        },
      );

      // Find southwest location radius
      const radiusSouthwest = getDistance(
        {
          lat: heroDTO.location.details.geometry.location.lat,
          lng: heroDTO.location.details.geometry.location.lng,
        },
        {
          lat: heroDTO.location.details.geometry.viewport.southwest.lat,
          lng: heroDTO.location.details.geometry.viewport.southwest.lng,
        },
      );

      //Take the biggest radius in meters
      const radius = Math.max(radiusNortheast, radiusSouthwest);

      if (radius) {
        hero.radius = radius;
      }
    }

    const savedHero = await this.repo.save(hero);

    await this.userService.updateUser(user.user_id, { type: 'Hero' });

    return savedHero;
  }

  async getClosestHeroes(location: string) {
    const myDataSource = new DataSource({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    });

    const appDataSource = await myDataSource.initialize();
    const queryRunner = await appDataSource.createQueryRunner();

    const results = await queryRunner.manager
      .query(`SELECT * from "hero"  INNER JOIN "user" ON "hero"."userId" = "user"."id" WHERE ST_Distance(
 location,
  '${location}'::geography
  ) < 5000`);

    return results;
  }
}
