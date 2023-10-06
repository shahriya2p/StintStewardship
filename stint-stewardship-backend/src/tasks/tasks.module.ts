/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tasks } from './tasks.entity';
// import { StudentsModule } from 'src/students/students.module';
import { TasksResolver } from './tasks.resolver';
import { TasksService } from './tasks.service';
import { SubjectModule } from 'src/subject/subject.module';
import { StudentsModule } from 'src/students/students.module';
import { TeachersModule } from 'src/teachers/teachers.module';
import { PersonalTasks } from './perosonal.tasks.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tasks]),
    TypeOrmModule.forFeature([PersonalTasks]),
    SubjectModule,
    TeachersModule,
    forwardRef(() => StudentsModule),
  ],
  providers: [TasksResolver, TasksService],
  exports: [TasksService, TasksModule],
})
export class TasksModule {}
