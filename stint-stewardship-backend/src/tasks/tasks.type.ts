/* eslint-disable prettier/prettier */
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Tasks')
export class TasksType {
  @Field(() => ID)
  tasks_id: string;

  @Field()
  task_name: string;

  @Field()
  semester: number;

  @Field()
  created_date: string;

  @Field()
  subject_code: number;

  @Field(() => [String], { nullable: true })
  alloted_students?: string[];

  @Field(() => String)
  teacher: string;

  @Field({ nullable: true })
  deadline?: string;
}
