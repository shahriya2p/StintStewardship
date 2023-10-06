/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateTasksType {
  @Field()
  task_name: string;

  @Field()
  semester: number;

  @Field()
  subject_code: number;

  @Field({ nullable: true })
  deadline?: string;
}
