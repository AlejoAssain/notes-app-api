import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from './entities';
import { User } from '../users/entities';
import { UsersService } from '../users/users.service';


@Module({
  imports: [TypeOrmModule.forFeature([Project, User])],
  controllers: [ProjectsController],
  providers: [ProjectsService, UsersService]
})
export class ProjectsModule {}
