/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MoveToStatusInput {
  @Field()
  task_name: string;

  @Field()
  student_roll: number;
}
