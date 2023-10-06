import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TeachersService } from './teachers.service';
import { TeachersType } from './teachers.type';
import { Teachers } from './teachers.entity';
import { CreateTeachersInput } from './create-teacher.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';
import { BroadcastInput } from './broadcast-student.input';
import { SwitchStatusInput } from './switchStatus.input';
import { PersonalTasksType } from 'src/tasks/task.input.custom';

@Resolver(() => TeachersType)
export class TeachersResolver {
  constructor(private teachersService: TeachersService) {}

  @Mutation(() => TeachersType)
  async createTeacher(
    @Args('createTeacherInput') createTeacherInput: CreateTeachersInput,
  ): Promise<Teachers> {
    return this.teachersService.createTeacher(createTeacherInput);
  }

  @Query(() => [TeachersType])
  async getTeachers(): Promise<Teachers[]> {
    return this.teachersService.getTeachers();
  }

  @Mutation(() => String)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async broadcastBasedOnSem(
    @Args('EnterMessageAndSem') broadcast: BroadcastInput,
  ) {
    return this.teachersService.broadcastBasedOnSem(broadcast);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async moveTaskToExecutingForTeacher(
    @Args('moveToExecution')
    moveToStatusInput: SwitchStatusInput,
  ): Promise<boolean> {
    return this.teachersService.moveTaskToExecution(moveToStatusInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async moveTaskToCompletedForTeacher(
    @Args('moveToCompleted')
    moveToStatusInput: SwitchStatusInput,
  ): Promise<boolean> {
    return this.teachersService.moveTaskToCompleted(moveToStatusInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async moveTaskToFinishedForTeacher(
    @Args('moveToFinished')
    moveToStatusInput: SwitchStatusInput,
  ): Promise<boolean> {
    return this.teachersService.movePersonalTaskToFinished(moveToStatusInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async moveTaskToReviewForTeacher(
    @Args('moveToReview')
    moveToStatusInput: SwitchStatusInput,
  ): Promise<boolean> {
    return this.teachersService.movePersonalTaskToReview(moveToStatusInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async moveTaskToTodoForTeacher(
    @Args('moveToTodo')
    moveToStatusInput: SwitchStatusInput,
  ): Promise<boolean> {
    return this.teachersService.moveTaskToTodo(moveToStatusInput);
  }

  @Query(() => TeachersType)
  async getTeacher(@Args('username') username: string) {
    return this.teachersService.getTeacher(username);
  }

  @Query(() => [PersonalTasksType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async getAllFinishedOfTeacher(@Args('userName') username: string) {
    return this.teachersService.getAllTeacherFinishedList(username);
  }
  @Query(() => [PersonalTasksType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async getAllReviewOfTeacher(@Args('userName') username: string) {
    return this.teachersService.getAllTeacherReviewList(username);
  }
  @Query(() => [PersonalTasksType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async getAllCompletedOfTeacher(@Args('userName') username: string) {
    return this.teachersService.getAllTeacherCompletedList(username);
  }
  @Query(() => [PersonalTasksType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async getAllExecutingOfTeacher(@Args('userName') username: string) {
    return this.teachersService.getAllTeacherExecuting(username);
  }
  @Query(() => [PersonalTasksType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async getAllTodoOfTeacher(@Args('userName') username: string) {
    return this.teachersService.getAllTeacherTodo(username);
  }
  @Query(() => [String])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async getRecentTeacher(@Args('username') username: string) {
    return this.teachersService.getRecentTeacher(username);
  }
  @Query(() => [Number])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  async getCountOfTeacherPersonalTasks(@Args('username') username: string) {
    return this.teachersService.getCountOfTeacherPersonalTasks(username);
  }
}
