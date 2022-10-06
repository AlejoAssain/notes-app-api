import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
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

  async getProjectParticipants(projectId: number) {
    const participants = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.projectsAsParticipant', 'project')
      .where(`projectId=${projectId}`)
      .getMany()

    return participants;

  }

  async getCurrentUser(username: string) : Promise<FilteredUser> {
    const user = await this.userRepository.findOneBy({ username: username})

    if (!user) throw new NotFoundException('User not found');

    return this.filterUserData(user);
  }

  async createUser(newUserData: CreateUserDto) : Promise<User> {
    const newUser : User = this.userRepository.create({
      email: newUserData.email,
      name: newUserData.name,
      username: newUserData.username,
      password: newUserData.password
    });

    try {
      await this.userRepository.save(newUser);
    } catch (e) {
      const duplicatedValue : string = e.sqlMessage.match(/'\s'/gi);

      console.log(duplicatedValue);

      throw new HttpException(e.sqlMessage, 409);
    }

    return newUser;
  }

  async updateUserData(updateUserData: UpdateUserDataDto, username: string) : Promise<FilteredUser> {
    const user = await this.userRepository.findOneBy({ username: username});

    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, updateUserData);

    try {
      await this.userRepository.save(user);
    } catch (e) {
      throw new HttpException(e.code, 409);
    }

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

    await this.userRepository.remove(user);

    return `User ${username} removed`;
  }

}
