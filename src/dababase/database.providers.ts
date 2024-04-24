import { Sequelize } from 'sequelize-typescript';
import User from '../entities/user.entity';
import Role from '../entities/role.entity';
import Product from '../entities/product.entity';
import { ConfigService } from '@nestjs/config';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        models: [Role, User, Product],
        logQueryParameters: true,
        ssl: true,
        dialectOptions: {
          ssl: {
            ca: configService.get<string>('database.cert'),
          },
        },
      });
      await sequelize.sync();
      return sequelize;
    },
  },
];
