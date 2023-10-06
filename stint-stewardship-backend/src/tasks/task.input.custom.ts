/* eslint-disable prettier/prettier */
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('PersonalTasks')
export class PersonalTasksType {
  @Field(() => ID)
  tasks_id: string;

  @Field()
  task_name: string;

  @Field()
  username: string;

  @Field(() => [String], { nullable: true })
  content?: string[];

  @Field(() => String, { nullable: true })
  alloted_user?: string;

  @Field(() => String, { nullable: true })
  created_date: string;

  @Field(() => String, { nullable: true })
  deadline?: string;
}
