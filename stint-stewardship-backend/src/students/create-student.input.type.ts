/* eslint-disable prettier/prettier */
import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, MinLength, IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateStudentInput {
  @Field({ nullable: false })
  @IsNotEmpty()
  stud_name: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  stud_roll: number;

  @Field({ nullable: false })
  @IsNumber()
  semester: number;

  @Field({ nullable: false })
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @Field({ nullable: false })
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
