import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';

import {
  CreateUserDto,
  UpdateUserDataDto,
  UpdateUserPasswordDto,
  FilteredUser
} from './dto';
import { User } from './entities';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  filterUserData(user: User) : FilteredUser {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name
    }
  }

  async getUser(username: string) : Promise<User> {
    const user = await this.userRepository.findOneBy({ username: username });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getCurrentUser(username: string) : Promise<FilteredUser> {
    const user = await this.userRepository.findOneBy({ username: username})

    if (!user) throw new NotFoundException('User not found');

    return this.filterUserData(user);
  }

  createUser(newUserData: CreateUserDto) : Promise<User> {
    const newUser : User = this.userRepository.create({
      email: newUserData.email,
      name: newUserData.name,
      username: newUserData.username,
      password: newUserData.password
    });

    return this.userRepository.save(newUser);
  }

  async updateUserData(updateUserData: UpdateUserDataDto, username: string) : Promise<FilteredUser> {
    const user = await this.userRepository.findOneBy({ username: username});

    Object.assign(user, updateUserData);

    await this.userRepository.save(user);

    return this.filterUserData(user);

  }

  async updateUserPassword(updateUserPasswordData: UpdateUserPasswordDto, username: string) {
    const user = await this.userRepository.findOneBy({ username: username});

    const passwordHash = await hash(updateUserPasswordData.password, 10);
    user.password = passwordHash;

    await this.userRepository.save(user);

    return this.filterUserData(user);
  }

  async removeUser(username: string) : Promise<string> {
    const user = await this.userRepository.findOneBy({ username: username });

    if (!user) throw new NotFoundException('User not found');

    this.userRepository.remove(user);

    return `User ${username} removed`;
  }

}
