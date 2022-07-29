import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import UserEntity from './user.entity';
import { hashPassword } from '../auth/encryption';
import { Coordinates } from '../help-requests/help-requests.service';

export interface User {
  id?: string;
  username: string;
  firstName: string;
  lastName: string;
  rank: number;
  avatar: string;
  status: 1 | 0;
  settings: any;
  type: string;
  password: string;
}

export interface Hero extends User {
  radius: number;
  categories: string[];
  longitude: number;
  latitude: number;
}

@Injectable()
export class UsersService {
  private heroes: Hero[] = [];

  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async addHero(hero: Hero) {
    const { password } = hero;
    const encrypted = await hashPassword(password);

    const heroCreated = await this.repository.create({
      ...hero,
      password: encrypted,
    });
    await this.repository.save(heroCreated);
    return heroCreated;
  }

  removeHero(id: string) {
    this.heroes = this.heroes.filter((hero) => hero.id !== id);
  }

  getHeroes() {
    return this.repository.find();
  }

  async getClosestHeroes(helpRequest: Coordinates) {
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

    const results = await queryRunner.manager.query(`select * from (
SELECT  *,( 3959 * acos( cos( radians(6.414478) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${helpRequest.lat}) ) + sin( radians(${helpRequest.lng}) ) * sin( radians( latitude ) ) ) ) AS distance
FROM "user"
) al
where distance < 4000
ORDER BY distance
LIMIT 20;`);

    return results;
  }

  /*

  select * from (
SELECT  *,( 3959 * acos( cos( radians(6.414478) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(52.50429790343473) ) + sin( radians(13.452538746743118) ) * sin( radians( latitude ) ) ) ) AS distance
FROM "user"
) al
where distance < 4000
ORDER BY distance
LIMIT 20;
   */

  /*

  SELECT *, point(52.50429790343473, 13.452538746743118) <@>  (point(longitude, latitude)::point) as distance
FROM "user"
WHERE (point(52.50429790343473, 13.452538746743118) <@> point(longitude, latitude)) < 4000
ORDER BY distance;
   */

  async findOne(username: string) {
    return this.repository.findOne({ where: [{ username }] });
  }
}
