import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import { User } from "src/modules/users/entities";
import { Project } from "src/modules/projects/entities/project.entity";


@Entity()
@Check(`"priority" BETWEEN 1 AND 5`)
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  name: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  priority: number;

  @ManyToOne(() => Project, (project) => project.notes)
  @JoinColumn()
  project: number;

  @ManyToOne(() => User, {
    cascade: false,
    nullable: true,
  })
  @JoinColumn({ name : 'assigned_user' })
  assignedUser: number;

  @Column({})
  completed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
