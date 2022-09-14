import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './dto';

import { User } from './entities';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async getUsers() : Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUser(id: number) : Promise<User> {
    const user = await this.userRepository.findOneBy({ id: id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async createUser(dto: CreateUserDto) {
    const newUser : User = this.userRepository.create({
      mail: dto.mail,
      name: dto.name,
      username: dto.username,
      password: dto.password
    });

    return this.userRepository.save(newUser);
  }

}
