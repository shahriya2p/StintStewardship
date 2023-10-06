/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SwitchStatusInput {
  @Field()
  task_name: string;

  @Field()
  teacher_username: string;
}
