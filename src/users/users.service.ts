import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import UserEntity from './user.entity';
import { Coordinates } from '../help-requests/help-requests.service';
import { Point } from 'geojson';

import KcAdminClient from 'keycloak-admin';

export const getKCClient = async () => {
  const kcAdminClient = new KcAdminClient({
    baseUrl: process.env.KEYCLOAK_BASE_URL,
    realmName: process.env.KEYCLOAK_REALM_NAME,
  });

  await kcAdminClient.auth({
    clientSecret: process.env.KEYCLOAK_SECRET,
    grantType: 'password',
    username: process.env.KEYCLOAK_USERNAME,
    password: process.env.KEYCLOAK_PASSWORD,
    clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID,
  });

  return kcAdminClient;
};

export interface User {
  id?: string;
  email: string;
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

  async addUser(user: Hero) {
    const { password, username, email, firstName, lastName, ...restUser } =
      user;

    const ks = await getKCClient();

    const kcUser = await ks.users.create({
      realm: 'hero',
      username: username,
      email: email,
      firstName,
      lastName,
      emailVerified: true,
      credentials: [{ type: 'password', value: password, temporary: false }],
      enabled: true,
    });

    const pointObject: Point = {
      type: 'Point',
      coordinates: [user.longitude, user.latitude],
    };

    const heroCreated = await this.repository.create({
      ...restUser,
      user_id: kcUser.id,
      location: pointObject,
    });

    await this.repository.save(heroCreated);

    const pureHero = { ...heroCreated };

    return pureHero;
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

    const results = await queryRunner.manager
      .query(`SELECT * from "user" WHERE ST_Distance(
 location,
  'SRID=4326;POINT(${helpRequest.lng} ${helpRequest.lat})'::geography
  ) < "user".radius;`);

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

CREATE EXTENSION cube;
CREATE EXTENSION earthdistance;

  SELECT *, point(52.50429790343473, 13.452538746743118) <@>  (point(longitude, latitude)::point) as distance
FROM "user"
WHERE (point(52.50429790343473, 13.452538746743118) <@> point(longitude, latitude)) < 4000
ORDER BY distance;
   */

  /*

  CREATE EXTENSION postgis;

CREATE TABLE foo (
  geog geography;
);

CREATE INDEX ON foo USING gist(geog);

INSERT INTO foo (geog)
  VALUES (ST_MakePoint(x,y));


  SELECT *
FROM foo
WHERE ST_DWithin(foo.geog, ST_MakePoint(x,y)::geography, distance_in_meters)
ORDER BY foo.geog <-> ST_MakePoint(x,y)::geography;

   */

  async findOne(username: string) {
    return this.repository.findOne({ where: [{ user_id: username }] });
  }
}
