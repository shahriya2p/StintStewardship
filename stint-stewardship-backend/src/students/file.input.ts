/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FileInput {
  @Field()
  stud_id: string;

  @Field()
  task_name: string;
}
