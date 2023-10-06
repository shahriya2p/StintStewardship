/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BroadcastInput {
  @Field()
  message: string;

  @Field()
  semester: number;

  @Field()
  name_of_teacher: string;
}
