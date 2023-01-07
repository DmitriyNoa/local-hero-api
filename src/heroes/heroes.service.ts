import { Injectable, NotFoundException } from '@nestjs/common';
import HeroEntity from './hero.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CategoriesService } from '../categories/categories.service';
import { LanguagesService } from '../languages/languages.service';
import HeroDTO, { Location } from './hero.dto';
import { Point } from 'geojson';
import { getDistance } from 'geolib';
import { HelpRequestsService } from '../help-requests/help-requests.service';

@Injectable()
export class HeroesService extends TypeOrmCrudService<HeroEntity> {
  constructor(
    @InjectRepository(HeroEntity) repo: Repository<HeroEntity>,
    private userService: UsersService,
    private categoriesService: CategoriesService,
    private languagesService: LanguagesService,
    private helpRequestService: HelpRequestsService,
  ) {
    super(repo);
  }

  async getTopHeroes() {
    const topHeroes = await this.repo
      .createQueryBuilder('heroes')
      .leftJoinAndSelect('heroes.categories', 'categories')
      .leftJoinAndSelect('heroes.languages', 'languages')
      .leftJoinAndSelect('heroes.user', 'user')
      .leftJoinAndSelect('user.reviews', 'reviews')
      .leftJoinAndSelect('heroes.heroHelpRequests', 'heroHelpRequests')
      .getMany();

    const heroUserIDs = topHeroes.map((hero) => hero.user.userId);

    const topHeroesWithUserMetadata =
      await this.userService.enrichUsersWithKCInfo(
        heroUserIDs,
        topHeroes,
        'user',
      );

    return topHeroesWithUserMetadata;
  }

  async getHero(id: string) {
    const hero = await this.repo.findOne({
      where: { id },
      relations: ['user', 'categories', 'languages'],
    });

    return hero;
  }

  async getUserHero(request: any) {
    const userId = request.user.id;
    const user = await this.userService.findOneOrFail(userId);
    const hero = await this.repo.findOne({
      where: { user },
      relations: ['user', 'categories', 'languages'],
    });

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

    await this.userService.updateUser(user.userId, { type: 'Hero' });

    return savedHero;
  }

  async getClosestHeroes(requestLocation: Location) {
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
      .query(`SELECT "hero"."id", "user"."avatar", "hero"."userId", "hero"."userId", "user"."user_id" from "hero"  INNER JOIN "user" ON "hero"."userId" = "user"."id" WHERE ST_Distance(
                        location,
                        'SRID=4326;POINT(${requestLocation.lng} ${requestLocation.lat})'::geography
                        ) < radius`);
    const heroUserIDs = results.map((user) => user.user_id);
    const users = await this.userService.getKCUsersByIDs(heroUserIDs);
    const heroes = results.map((hero) => this.getHeroByIDOrFail(hero.id));

    // TODO: Move this into a single SQL query on top
    const heroesData = await Promise.all(heroes);

    const fullHeroUsers = results.map((hero) => {
      let resultHero = hero;
      const heroUser = users.find((user) => user.userId === hero.user_id);
      const heroData = heroesData.find((heroData) => heroData.id === hero.id);

      if (heroUser) {
        resultHero = { ...hero, ...heroUser };
      }

      if (heroData) {
        resultHero = {
          ...resultHero,
          categories: heroData.categories,
          languages: heroData.languages,
        };
      }

      return resultHero;
    });

    return fullHeroUsers;
  }

  async getHeroesByHelpRequestID(id: string) {
    const helpRequest = await this.helpRequestService.findOne({
      where: { id },
      relations: ['categories', 'languages', 'heroHelpRequests'],
    });

    const matchingHeroes = await this.repo
      .createQueryBuilder('heroes')
      .innerJoinAndSelect('heroes.categories', 'categories')
      .innerJoinAndSelect('heroes.languages', 'languages')
      .innerJoinAndSelect('heroes.user', 'user')
      .leftJoinAndSelect('heroes.heroHelpRequests', 'heroHelpRequests')
      .leftJoinAndSelect('heroHelpRequests.helpRequest', 'heroHelpRequestData')
      .where(
        `ST_Distance(
                        heroes.location,
                        ST_GeomFromGeoJSON(:requestLocation)
                        ) < heroes.radius`,
        { requestLocation: JSON.stringify(helpRequest.location) },
      )
      .where(`categories.id IN (:...requestCategories)`, {
        requestCategories: helpRequest.categories.map((cat) => cat.id),
      })
      .andWhere(`languages.id IN (:...requestLanguages)`, {
        requestLanguages: helpRequest.languages.map((lang) => lang.id),
      })
      .getMany();

    const heroUserIDs = matchingHeroes.map((hero) => hero.user.userId);
    const users = await this.userService.getKCUsersByIDs(heroUserIDs);

    const matchingHeroesWithUserData = matchingHeroes.map((hero) => {
      let resultHero = hero;
      const heroUser = users.find((user) => user.userId === hero.user.userId);

      if (heroUser) {
        resultHero = { ...hero, ...heroUser };
      }

      return resultHero;
    });

    return matchingHeroesWithUserData;
  }

  async getHeroByIDOrFail(id: string) {
    const hero = this.repo.findOne({
      where: { id },
      relations: ['categories', 'languages'],
    });

    if (!hero) {
      throw new NotFoundException('Hero not found');
    }

    return hero;
  }
}
