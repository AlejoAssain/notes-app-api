import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  AddProjectParticipantDto,
  CreateProjectDto,
  RemoveProjectParticipantDto,
  UpdateProjectDto
} from './dto';
import { ProjectsService } from './projects.service';


@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserProjects(@Req() request) {
    return this.projectsService.getUserProjects(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getProjectById(@Req() request, @Param('id') projectId: number) {
    return this.projectsService.getProjectById(projectId, request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createProject(@Body() createProjectDto: CreateProjectDto, @Req() request) {
    return this.projectsService.createProject(createProjectDto, request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateProjectData(@Req() request, @Param('id') projectId: number, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.updateProjectData(projectId, request.user.id, updateProjectDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/add-participant/:id')
  addProjectParticipant(
    @Req() request,
    @Param('id') projectId: number,
    @Body() addProjectParticipantDto: AddProjectParticipantDto
  ) {
    return this.projectsService.addProjectParticipant(projectId, request.user.id, addProjectParticipantDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/remove-participant/:id')
  removeProjectParticipant(
    @Req() request,
    @Param('id') projectId: number,
    @Body() removeProjectParticipantDto: RemoveProjectParticipantDto
  ) {
    return this.projectsService.removeProjectParticipant(projectId, request.user.id, removeProjectParticipantDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeProject(@Req() request, @Param('id') projectId: number) {
    return this.projectsService.removeProject(projectId, request.user.id);
  }
}
