import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import UserEntity from './user.entity';
import { Coordinates } from '../help-requests/help-requests.service';

import KcAdminClient from 'keycloak-admin';
import UserDTO from './user.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

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
export class UsersService extends TypeOrmCrudService<UserEntity> {
  private heroes: Hero[] = [];

  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {
    super(repository);
  }

  async addUser(user: Hero) {
    const { password, username, email, firstName, lastName, ...restUser } =
      user;

    const ks = await getKCClient();
    const kcUser = await ks.users.create({
      realm: 'LocalChampion',
      username: username,
      email: email,
      firstName,
      lastName,
      emailVerified: true,
      credentials: [{ type: 'password', value: password, temporary: false }],
      enabled: true,
    });

    const heroCreated = await this.repository.create({
      ...restUser,
      userId: kcUser.id,
    });

    await this.repository.save(heroCreated);

    const pureUser = { ...heroCreated };

    return pureUser;
  }

  removeHero(id: string) {
    this.heroes = this.heroes.filter((hero) => hero.id !== id);
  }

  addPureUser(userId) {
    const user = new UserEntity();

    user.userId = userId;
    user.type = 'User';

    return this.repository.save(user);
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
  ) < 10000`);

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

  async findUser(username: string) {
    const ks = await getKCClient();

    const kcUser = await ks.users.find({ username, realm: 'LocalChampion' });

    if (kcUser && kcUser.length) {
      const { username, email, firstName, lastName, attributes } = kcUser[0];

      const profile = await this.repository.findOne({
        where: [{ userId: kcUser[0].id }],
      });

      return {
        ...profile,
        username,
        email,
        firstName,
        lastName,
        attributes,
      };
    } else {
      throw new NotFoundException(new Error('User not found'));
    }
  }

  async findUserProfile(username: string) {
    const ks = await getKCClient();

    const kcUser = await ks.users.find({ username, realm: 'LocalChampion' });

    if (kcUser && kcUser.length) {
      const { username, email, firstName, lastName } = kcUser[0];

      const profile = await this.repository.findOne({
        where: [{ userId: kcUser[0].id }],
      });

      return profile;
    } else {
      throw new NotFoundException(new Error('User not found'));
    }
  }

  async findOneOrFail(id: string): Promise<UserEntity> {
    const user = await this.repository.findOne({ where: { userId: id } });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async updateUser(id: string, user: Partial<UserDTO>) {
    const ks = await getKCClient();

    if (user.firstName || user.lastName) {
      await ks.users.update(
        { id, realm: 'LocalChampion' },
        { firstName: user.firstName, lastName: user.lastName },
      );
    }

    await this.repository.update(
      { userId: id },
      {
        avatar: user.avatar,
        type: user.type,
        description: user.description,
        city: user.city,
      },
    );

    return user;
  }

  async getKCUsersByIDs(ids: string[]) {
    const ks = await getKCClient();
    const usersRequests = ids.map((id) =>
      ks.users.findOne({ id, realm: 'LocalChampion' }),
    );
    const users = await Promise.all(usersRequests);

    return users.map((user) => ({
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      attributes: user.attributes,
    }));
  }

  async enrichUsersWithKCInfo(userIDs, entitiesArray, accessor) {
    const users = await this.getKCUsersByIDs(userIDs);

    const matchingHeroesWithUserData = entitiesArray.map((entity) => {
      let resultHero = entity;
      const heroUser = users.find(
        (user) => user.userId === entity[accessor].userId,
      );

      if (heroUser) {
        resultHero = {
          ...entity,
          [accessor]: {
            ...entity[accessor],
            ...heroUser,
          },
        };
      }

      return resultHero;
    });

    return matchingHeroesWithUserData;
  }
}
