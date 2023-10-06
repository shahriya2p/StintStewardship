import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Students } from './students.entity';
import { StudentsResolver } from './students.resolver';
import { StudentsService } from './students.service';
import { TasksModule } from 'src/tasks/tasks.module';
import { TeachersModule } from 'src/teachers/teachers.module';
import { StudentsController } from './students.controller';
import { MulterModule } from '@nestjs/platform-express';
import { File } from './file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Students]),
    TypeOrmModule.forFeature([File]),
    forwardRef(() => TasksModule),
    forwardRef(() => TeachersModule),
    MulterModule.register({ dest: './uploads' }),
  ],
  providers: [StudentsResolver, StudentsService],
  exports: [StudentsService],
  controllers: [StudentsController],
})
export class StudentsModule {}
