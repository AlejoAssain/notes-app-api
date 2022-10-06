import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Note } from './entities';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities';


@Module({
  imports: [TypeOrmModule.forFeature([Note, User])],
  controllers: [NotesController],
  providers: [NotesService, UsersService]
})
export class NotesModule {}
