import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import UserEntity from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        console.log(
          "configService.get('POSTGRES_HOST')",
          configService.get('POSTGRES_HOST'),
        );
        console.log(
          "configService.get('POSTGRES_USER')",
          configService.get('POSTGRES_USER'),
        );
        console.log(
          "configService.get('POSTGRES_PASSWORD')",
          configService.get('POSTGRES_PASSWORD'),
        );

        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          entities: [UserEntity],
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
