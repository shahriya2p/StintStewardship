/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateTeachersInput {
  @Field()
  @IsNotEmpty()
  teacher_name: string;

  @Field()
  @IsNotEmpty()
  teacher_subject: string;

  @Field()
  @IsNumber()
  @IsNotEmpty()
  subject_code: number;

  @Field()
  @IsEmail()
  username: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
