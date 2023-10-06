/* eslint-disable prettier/prettier */
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('File')
export class FileType {
  @Field()
  file_id: string;

  @Field()
  task_Name: string;

  @Field()
  stud_id: string;

  @Field()
  fileName: string;

  @Field()
  type: string;
}
