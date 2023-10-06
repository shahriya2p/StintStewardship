/* eslint-disable prettier/prettier */
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { StudentsModule } from './students/students.module';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { SubjectModule } from './subject/subject.module';
import { Students } from './students/students.entity';
import { ApolloDriver } from '@nestjs/apollo';
import { Tasks } from './tasks/tasks.entity';
import { Subject } from './subject/subject.entity';
import { Teachers } from './teachers/teachers.entity';
import { TeachersModule } from './teachers/teachers.module';
import { AuthModule } from './auth/auth.module';
import { PersonalTasks } from './tasks/perosonal.tasks.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { File } from './students/file.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: `mongodb`,
      url: `${process.env.DB_URL}`,
      synchronize: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoLoadEntities: true,
      entities: [Students, Tasks, Teachers, Subject, PersonalTasks, File],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      driver: ApolloDriver,
      context: ({ req }) => ({ headers: req.headers }),
    }),
    ScheduleModule.forRoot(),
    TasksModule,
    StudentsModule,
    TeachersModule,
    SubjectModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
