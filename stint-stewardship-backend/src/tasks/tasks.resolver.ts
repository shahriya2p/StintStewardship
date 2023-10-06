/* eslint-disable prettier/prettier */
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { TasksType } from './tasks.type';
import { TasksService } from './tasks.service';
import { Tasks } from './tasks.entity';
import { CreateTasksType } from './create-tasks.input';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { CreateCustomTasksType } from './task-custom.input.type';
import { PersonalTasksType } from './task.input.custom';
import { Interval } from '@nestjs/schedule';

@Resolver(() => TasksType)
export class TasksResolver {
  constructor(private tasksService: TasksService) {}

  @Mutation(() => TasksType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async createTask(
    @Args('createTasksType') createTasksType: CreateTasksType,
  ): Promise<Tasks> {
    return await this.tasksService.createTask(createTasksType);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  @Query(() => [TasksType])
  async getTasks(): Promise<Tasks[]> {
    return await this.tasksService.getTasks();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  async deleteTask(@Args('id') id: string) {
    return this.tasksService.deleteTask(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  async deletePersonalTaskForStudent(
    @Args('name') name: string,
    @Args('username') username: string,
  ) {
    return this.tasksService.deletePersonalTaskForStud(name, username);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  async deletePersonalTaskForTeacher(
    @Args('name') name: string,
    @Args('username') username: string,
  ) {
    return this.tasksService.deletePersonalTaskForTeacher(name, username);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Mutation(() => PersonalTasksType)
  async createTaskForPersonal(
    @Args('createForPersonalUse') createCustomTasksInput: CreateCustomTasksType,
  ) {
    return this.tasksService.createTaskForPersonal(createCustomTasksInput);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  @Query(() => [TasksType])
  async getTasksByTeacher(@Args('getTasks') username: string) {
    return this.tasksService.getTasksByTeacher(username);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [TasksType])
  async searchTasks(
    @Args('taskName') task_name: string,
    @Args('username') username: string,
  ) {
    return this.tasksService.searchT(task_name, username);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Query(() => [PersonalTasksType])
  async searchPersonalTasks(
    @Args('taskName') task_name: string,
    @Args('username') username: string,
  ) {
    return this.tasksService.searchPT(task_name, username);
  }

  @Query(() => [Boolean])
  async checkDeadlines(): Promise<any> {
    return this.tasksService.checkDeadlines();
  }

  @Interval(86400000)
  handle() {
    this.checkDeadlines();
  }
}
