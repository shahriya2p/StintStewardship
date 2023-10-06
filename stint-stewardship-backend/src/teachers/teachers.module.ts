import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teachers } from './teachers.entity';
import { TeachersResolver } from './teachers.resolver';
import { TeachersService } from './teachers.service';
import { SubjectModule } from 'src/subject/subject.module';
import { StudentsModule } from 'src/students/students.module';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Teachers]),
    forwardRef(() => StudentsModule),
    forwardRef(() => SubjectModule),
    forwardRef(() => TasksModule),
  ],
  providers: [TeachersResolver, TeachersService],
  exports: [TeachersService],
})
export class TeachersModule {}
