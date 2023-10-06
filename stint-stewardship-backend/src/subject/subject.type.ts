/* eslint-disable prettier/prettier */
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Subject')
export class SubjectType {
  @Field(() => ID)
  subject_id: string;

  @Field()
  sub_name: string;

  @Field()
  sub_code: number;

  @Field()
  sub_of_sem: number;
}
