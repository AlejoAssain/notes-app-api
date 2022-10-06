import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from "typeorm";

import { Note } from "src/modules/notes/entities";
import { User } from "src/modules/users/entities";


@Entity()
@Unique(['name', 'ownerId'])
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  name: string;

  @Column()
  description: string;

  @PrimaryColumn({ name: 'owner_id' })
  ownerId: number

  @ManyToOne(() => User, (user) => user.projects)
  @JoinColumn({ name: 'owner_id' })
  owner: number;

  @OneToMany(() => Note, (note) => note.project, { cascade: true })
  notes: Note[];

  @ManyToMany(() => User, (user) => user.projectsAsParticipant, { cascade: ["remove"] })
  @JoinTable()
  participants: User[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
