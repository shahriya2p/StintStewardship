/* eslint-disable prettier/prettier */
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class TasksWithStatusType {
  @Field(() => [String], { nullable: true })
  todo: string[];

  @Field(() => [String], { nullable: true })
  executing: string[];

  @Field(() => [String], { nullable: true })
  completed: string[];

  @Field(() => [String], { nullable: true })
  review: string[];

  @Field(() => [String], { nullable: true })
  finished: string[];
}

@ObjectType('Students')
export class StudentsType {
  @Field(() => ID)
  stud_id: string;

  @Field()
  stud_name: string;

  @Field()
  stud_roll: number;

  @Field()
  semester: number;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field(() => [String], { nullable: true })
  tasks?: string[];

  @Field(() => [String], { nullable: true })
  comment?: string[];

  @Field(() => TasksWithStatusType, { nullable: true })
  taskswithstatus?: TasksWithStatusType;

  @Field(() => TasksWithStatusType, { nullable: true })
  personalTasks?: TasksWithStatusType;
}
