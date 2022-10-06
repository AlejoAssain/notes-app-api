import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities';


@Injectable()
export class NotesService {
  constructor (
    @InjectRepository(Note) noteRepository : Repository<Note>
  ) {}

  create(createNoteDto: CreateNoteDto) {
    return 'This action adds a new note';
  }

  findAll() {
    return `This action returns all notes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} note`;
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }

  remove(id: number) {
    return `This action removes a #${id} note`;
  }
}
