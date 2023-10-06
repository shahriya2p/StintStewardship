/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSubjectInput {
  @Field()
  sub_name: string;

  @Field()
  sub_code: number;

  @Field()
  sub_of_sem: number;
}
