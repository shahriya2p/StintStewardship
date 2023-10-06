import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { SubjectService } from './subject.service';
import { SubjectType } from './subject.type';
import { Subject } from './subject.entity';
import { CreateSubjectInput } from './create-subject.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/role.enum';

@Resolver(() => SubjectType)
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectResolver {
  constructor(private subjectService: SubjectService) {}

  @Mutation(() => SubjectType)
  @Roles(Role.Teacher)
  async createSubject(
    @Args('createSubjectInput') createSubjectInput: CreateSubjectInput,
  ): Promise<Subject> {
    return this.subjectService.createSubject(createSubjectInput);
  }

  @Query(() => [SubjectType])
  @Roles(Role.Teacher)
  async getSubjects(): Promise<Subject[]> {
    return await this.subjectService.getSubjects();
  }

  @Query(() => SubjectType)
  @Roles(Role.Student)
  async getSubjectById(
    @Args('subject_code') subject_code: number,
  ): Promise<Subject> {
    return await this.subjectService.getSubjectById(subject_code);
  }

  @Mutation(() => Boolean)
  @Roles(Role.Teacher)
  async deleteSubject(@Args('id') id: string) {
    return this.subjectService.deleteSubject(id);
  }
}
