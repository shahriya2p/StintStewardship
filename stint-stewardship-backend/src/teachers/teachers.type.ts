/* eslint-disable prettier/prettier */
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TasksWithStatusTypeForTeacher {
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

@ObjectType('Teachers')
export class TeachersType {
  @Field(() => ID)
  teacher_id: string;

  @Field()
  teacher_name: string;

  @Field()
  teacher_subject: string;

  @Field()
  subject_code: number;

  @Field(() => [String], { nullable: true })
  assigned_tasks?: string[];

  @Field(() => TasksWithStatusTypeForTeacher, { nullable: true })
  personalTasks?: TasksWithStatusTypeForTeacher;
}
