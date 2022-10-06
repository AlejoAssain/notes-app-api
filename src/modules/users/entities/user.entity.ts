import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany
} from "typeorm";

import { Project } from "src/modules/projects/entities";


@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @OneToMany(() => Project, (project) => project.owner, { cascade: true })
  projects: Project[];

  @ManyToMany(() => Project, (project) => project.participants)
  projectsAsParticipant: Project[]

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

}
