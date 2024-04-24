import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserLoginDto } from '../dto/user.login.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthConstants } from '../constants/auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const userLoginDto = new UserLoginDto();
    userLoginDto.email = email;
    userLoginDto.password = password;
    const user = (
      await this.usersService.findByEmailAndPassword(userLoginDto)
    )?.toJSON();
    if (!!user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(payload: any) {
    return {
      token: this.jwtService.sign(
        {
          email: payload.email,
          id: payload.id,
          roleId: payload.roleId,
        },
        {
          secret: AuthConstants.jwtOptions.secret,
        },
      ),
    };
  }
}
