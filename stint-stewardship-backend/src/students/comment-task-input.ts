/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CommentTaskInput {
  @Field()
  task_name: string;

  @Field()
  stud_name: string;

  @Field()
  comment: string;
}
