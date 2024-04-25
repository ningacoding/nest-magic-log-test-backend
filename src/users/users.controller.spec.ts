import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { DatabaseModule } from '../dababase/database.module';
import { v4 as uuidv4 } from 'uuid';
import Role from '../entities/role.entity';
import User from '../entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { AuthModule } from '../auth/auth.module';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        DatabaseModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [configuration],
        }),
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should initialize app data', async () => {
    let count = await Role.count();
    if (count === 0) {
      await Role.bulkCreate([
        {
          id: 1,
          name: 'admin',
        },
        {
          id: 2,
          name: 'seller',
        },
        {
          id: 3,
          name: 'buyer',
        },
      ]);
      count = 3;
    }
    const adminUser = await User.findOne({
      attributes: ['id'],
      include: [
        {
          model: Role,
          attributes: ['id'],
        },
      ],
    });
    if (!adminUser) {
      const newUser = new CreateUserDto();
      newUser.roleId = 1;
      newUser.email = 'admin@dominio.com';
      newUser.password = 'admin';
      await usersController.create(newUser);
    }
    count++;
    expect(count).toEqual(4);
  });

  it('should create a new user', async () => {
    const newUser = new CreateUserDto();
    newUser.roleId = 2;
    newUser.email = `kuriel+${uuidv4()}@dominio.com`;
    newUser.password = 'abc';
    const result = await usersController.create(newUser);
    expect(result.id).toBeDefined();
  });
});
