import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateProjectDto,
  UpdateProjectDto,
  FilteredProject,
  AddProjectParticipantDto,
  RemoveProjectParticipantDto
} from './dto'
import { Project } from './entities';
import { UsersService } from '../users/users.service';
import { NotFoundException } from '@nestjs/common/exceptions';


@Injectable()
export class ProjectsService {
  constructor (
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly usersService: UsersService
  ) {}

  filterProjectData(project: Project) : FilteredProject {
    const filteredProject : FilteredProject = {
      id: project.id,
      name: project.name,
      description: project.description,
      ownerId: project.ownerId,
    };

    if (project.participants) {
      filteredProject.participants = project.participants
        .map(participant => this.usersService.filterUserData(participant));
    }

    return filteredProject;
  }

  async getProject(projectId: number, userId: number) : Promise<Project> {
    // join project and users on participants, and get only the ones with this project id, and where the owner is
    // the current user

    const project = await this.projectRepository.findOneBy({ id: projectId, ownerId: userId});

    if (!project) throw new NotFoundException('Project not found');

    const participants = await this.usersService.getProjectParticipants(projectId);

    project.participants = participants;

    return project;
  }

  async getUserProjects(userId: number) : Promise<FilteredProject[]> {
    const projects : Project[] = await this.projectRepository.findBy({ ownerId: userId })

    const filteredProjects = projects.map(project => this.filterProjectData(project));

    return filteredProjects;
  }

  async getProjectById(projectId: number, userId: number) : Promise<FilteredProject> {
    const project = await this.getProject(projectId, userId);

    return this.filterProjectData(project);
  }

  async createProject(createProjectDto: CreateProjectDto, userId: number) : Promise<FilteredProject> {
    const newProject = this.projectRepository.create({
      name: createProjectDto.name,
      description: createProjectDto.description,
      ownerId: userId
    });

    try {
      await this.projectRepository.save(newProject);

    } catch (e) {
      throw new HttpException(e.sqlMessage, 409);

    }

    return this.filterProjectData(newProject);
  }

  async updateProjectData(projectId: number, userId: number, projectNewData: UpdateProjectDto) : Promise<FilteredProject> {
    const project = await this.projectRepository.findOneBy({ id: projectId, ownerId: userId });

    if (!project) throw new NotFoundException('Project not found');

    Object.assign(project, projectNewData);

    try {
      await this.projectRepository.save(project);
    } catch (e) {
      throw new HttpException(e.sqlMessage, 409);
    }

    return this.filterProjectData(project);
  }

  async addProjectParticipant(
    projectId: number,
    userId: number,
    addProjectParticipantDto: AddProjectParticipantDto
  ) : Promise<FilteredProject>{
    const project = await this.getProject(projectId, userId);

    const participant = await this.usersService.getUser(addProjectParticipantDto.participantUsername);

    if (project.participants) {
      project.participants.forEach(p => {
        if (p.id === participant.id) throw new HttpException('User is a participant already', 409);
      })

      project.participants.push(participant);
    } else {
      project.participants = [participant];
    }

    await this.projectRepository.save(project);

    return this.filterProjectData(project);
  }

  async removeProjectParticipant(
    projectId: number,
    userId: number,
    removeProjectParticipantDto: RemoveProjectParticipantDto
  ) : Promise<FilteredProject | string>{
    const project = await this.getProject(projectId, userId);

    let deleted : boolean = false;

    if (project.participants) {
      for (let i = 0; i < project.participants.length; i++) {
        if (project.participants[i].username === removeProjectParticipantDto.participantUsername) {
          project.participants.splice(i, 1);
          deleted = true;
          break;
        }
      }

    } else throw new HttpException('No participants in project', 409);

    if (deleted) {
      await this.projectRepository.save(project);

      return this.filterProjectData(project);
    }

    return 'User not in project'

  }

  async removeProject(projectId: number, userId: number) : Promise<string> {
    const project = await this.projectRepository.findOneBy({ id: projectId, ownerId: userId });

    if (!project) throw new NotFoundException('Project not found');

    await this.projectRepository.remove(project);

    return `Project ${projectId} removed`;
  }

}
