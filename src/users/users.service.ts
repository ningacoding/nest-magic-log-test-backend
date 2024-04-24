import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import User from '../entities/user.entity';
import * as crypto from 'crypto';
import { UserLoginDto } from '../dto/user.login.dto';
import { Op } from 'sequelize';
import { RoleEnum } from '../constants/role.enum';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto) {
    createUserDto.password = crypto
      .createHash('md5')
      .update(createUserDto.password)
      .digest('hex');
    return (await User.create(createUserDto as any)).toJSON();
  }

  findAll() {
    return User.findAll();
  }

  findAllProviders() {
    return User.findAll({
      where: {
        [Op.or]: [{ roleId: RoleEnum.Admin }, { roleId: RoleEnum.Seller }],
      },
    });
  }

  async findOne(id: number) {
    const user = (await User.findByPk(id)).toJSON();
    delete user.password;
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return User.update(updateUserDto, {
      where: {
        id,
      },
    });
  }

  remove(id: number) {
    return User.destroy({
      where: {
        id,
      },
    });
  }

  async findByEmailAndPassword(userLoginDto: UserLoginDto) {
    return User.findOne({
      where: {
        email: userLoginDto.email,
        password: crypto
          .createHash('md5')
          .update(userLoginDto.password)
          .digest('hex'),
      },
    });
  }
}
