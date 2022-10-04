import { Injectable, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { compare, hash } from 'bcrypt';

import { UsersService } from '../modules/users/users.service';
import { LoginAuthDto, RegisterAuthDto, AuthResponse } from './dto';


@Injectable()
export class AuthService {
  salt: number;

  constructor (
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {
    this.salt = 10;
  }

  generateToken(id: number, username: string) {
    const payload = {
      id: id,
      username: username }
    return this.jwtService.sign(payload);
  }

  async registerUser(newUserData : RegisterAuthDto) : Promise<AuthResponse> {
    const { password : userPassword } = newUserData;

    const passwordHash = await hash(userPassword, this.salt);

    const newUser = await this.usersService.createUser({
      email: newUserData.email,
      name: newUserData.name,
      username: newUserData.username,
      password: passwordHash
    });

    return {
      user: this.usersService.filterUserData(newUser),
      token: this.generateToken(newUser.id, newUser.username)
    };
  }

  async loginUser(loginUserData : LoginAuthDto) : Promise<AuthResponse> {
    const user = await this.usersService.getUser(loginUserData.username);
    const passwordHash = user.password;

    const passwordCheck = await compare(loginUserData.password, passwordHash);

    if (!passwordCheck) {
      throw new HttpException('Incorrect password', 403);
    }

    return {
      user: this.usersService.filterUserData(user),
      token: this.generateToken(user.id, user.username)
    };
  }
}
