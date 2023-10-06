/* eslint-disable prettier/prettier */
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tasks } from './tasks.entity';
import { Repository } from 'typeorm';
import { CreateTasksType } from './create-tasks.input';
import { v4 as uuid } from 'uuid';
import { SubjectService } from 'src/subject/subject.service';
import { StudentsService } from 'src/students/students.service';
import { Students } from 'src/students/students.entity';
import { TeachersService } from 'src/teachers/teachers.service';
import { createTransport } from 'nodemailer';
import { CreateCustomTasksType } from './task-custom.input.type';
import { PersonalTasks } from './perosonal.tasks.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(PersonalTasks)
    private personalTasksRepository: Repository<PersonalTasks>,
    @InjectRepository(Tasks) private tasksRepository: Repository<Tasks>,
    private subjectService: SubjectService,
    @Inject(forwardRef(() => StudentsService))
    private studentService: StudentsService,
    private teacherService: TeachersService,
  ) {}

  async createTask(createTasksType: CreateTasksType): Promise<Tasks> {
    const { task_name, semester, subject_code, deadline } = createTasksType;
    if (task_name !== '' && semester) {
      const subject = await this.subjectService.getSubjectById(subject_code);
      const usernames = await this.studentService.getStudentUsernamesBySem(
        semester,
      );
      if (subject) {
        const teacher = await this.teacherService.getTeacherBySub(
          subject.sub_name,
        );
        if (teacher) {
          const task = this.tasksRepository.create({
            tasks_id: uuid(),
            task_name,
            semester,
            subject_code: subject.sub_code,
            alloted_students: usernames || [],
            teacher: teacher.teacher_name,
            created_date: new Date().toLocaleString(),
            deadline: deadline,
          });
          await this.studentService.assignStudentsWithTask(task);
          const mailTransporter = createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            secure: false,
            auth: {
              user: `${process.env.USER}`,
              pass: `${process.env.PASS}`,
            },
          });
          mailTransporter.sendMail(
            {
              from: `${process.env.USER}`,
              to: Array.isArray(usernames) ? usernames.join(',') : usernames,
              subject: `New Task Assigned for Subject ${subject.sub_name}`,
              html: `<html>
                  <body>
                    <h1>New Tasks of ${subject.sub_code} created on ${task.created_date}</h1>
                    <p>Tasks is ${task.task_name}, Deadline:- ${task.deadline}</p>
                  </body>
            </html>`,
            },
            (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log('Mails Sent To Students For New Task Created');
              }
            },
          );
          mailTransporter.sendMail(
            {
              from: `${process.env.USER}`,
              to: `${teacher.username}`,
              subject: `Created This Task Successfully`,
              html: `<html>
                  <body>
                    <h1>Created New Task For Students of Sem ${task.semester}</h1>
                    <p>The Email was sent to all the Students, the students are ${task.alloted_students}</p>
                  </body>
            </html>`,
            },
            (err) => {
              if (err) {
                console.log(err);
              } else {
                console.log('Email Sent To Teacher For Creating New Task');
              }
            },
          );
          return await this.tasksRepository.save(task);
        } else {
          throw new Error('Please Assign Task of your subject');
        }
      } else {
        throw new Error('Subject of that subject code was not found');
      }
    } else {
      throw new Error('Task Name And Semester Cannot Be Empty');
    }
  }

  async getTasks(): Promise<Tasks[]> {
    const tasks = await this.tasksRepository.find();
    return tasks;
  }

  async getTasksBySem(semester: number) {
    const tasks = await this.tasksRepository.find({ where: { semester } });
    return tasks.map((task) => task.task_name);
  }

  async assignTasksToNewStudent(student: Students) {
    const tasks = await this.tasksRepository.find({
      where: { semester: student.semester },
    });
    tasks.map(
      (task) =>
        (task.alloted_students = [...task.alloted_students, student.stud_id]),
    );
    await this.tasksRepository.save(tasks);
  }

  //checking this
  async deleteTask(id: string) {
    const task_to_delete = await this.tasksRepository.findOne({
      where: { tasks_id: id },
    });
    if (task_to_delete) {
      await this.studentService.deleteUploadedFileByTask(
        task_to_delete.task_name,
        'school',
      );
      await this.studentService.removeTaskFromStudent(task_to_delete.task_name);
      const result = await this.tasksRepository.delete(task_to_delete._id);
      return result.affected > 0;
    } else {
      return false;
    }
  }

  async deletePersonalTaskForStud(name: string, username: string) {
    const per_task = await this.personalTasksRepository.findOne({
      where: { task_name: name, username },
    });
    if (per_task) {
      this.studentService.deleteFileUpload(
        per_task.username,
        per_task.task_name,
        'personal',
      );
      //check something for delete task!
      await this.studentService.removePersonalTaskFromStudents(
        per_task.task_name,
        per_task.username,
      );
      const result = await this.personalTasksRepository.delete(per_task._id);
      return result.affected > 0;
    } else {
      throw new Error('Student Task Not Found');
    }
  }

  async deletePersonalTaskForTeacher(name: string, username: string) {
    const per_task = await this.personalTasksRepository.findOne({
      where: { task_name: name, username },
    });
    if (per_task) {
      await this.studentService.deleteFileUpload(
        per_task.username,
        per_task.task_name,
        'personal',
      );
      await this.teacherService.removeTaskFromTeacher(
        per_task.task_name,
        per_task.username,
      );
      const result = await this.personalTasksRepository.delete(per_task._id);
      return result.affected > 0;
    } else {
      throw new Error('Teacher Task Not Found');
    }
  }

  async searchTaskByName(task_name: string): Promise<Tasks> {
    const task = await this.tasksRepository.findOne({ where: { task_name } });
    if (task) {
      return task;
    }
  }

  async searchT(task_name: string, username: string) {
    const task = await this.tasksRepository.find({
      where: { task_name, alloted_students: username },
    });
    if (task) {
      return task;
    }
  }

  async searchPT(task_name: string, username: string) {
    const personalTask = await this.personalTasksRepository.find({
      where: { task_name, alloted_user: username },
    });
    if (personalTask) {
      return personalTask;
    }
  }

  async searchPersonalTaskByName(task_name: string) {
    const personalTask = await this.personalTasksRepository.findOne({
      where: { task_name },
    });
    if (personalTask) {
      return personalTask;
    }
  }

  async createTaskForPersonal(createCustomTasksInput: CreateCustomTasksType) {
    const { task_name, content, username, deadline } = createCustomTasksInput;
    if (task_name !== '') {
      const teacher = await this.teacherService.getTeacher(username);
      const student = await this.studentService.getStudent(username);
      if (teacher) {
        const user = this.personalTasksRepository.create({
          tasks_id: uuid(),
          task_name,
          content,
          username,
          deadline: deadline,
          alloted_user: teacher.username,
          created_date: new Date().toLocaleString(),
        });
        const createdTask = await this.personalTasksRepository.save(user);
        await this.teacherService.assignTeacherWithPersonalTask(createdTask);
        return createdTask;
      } else if (student) {
        const user = this.personalTasksRepository.create({
          tasks_id: uuid(),
          content,
          task_name,
          username,
          deadline: deadline,
          alloted_user: student.username,
          created_date: new Date().toLocaleString(),
        });
        const createdTask = await this.personalTasksRepository.save(user);
        this.studentService.assignStudentWithPersonalTask(createdTask);
        return createdTask;
      } else {
        throw new Error('User Not Found, Please Register As One');
      }
    } else {
      throw new Error('Task Name Cannot Be Empty');
    }
  }

  async getSemFromTasks() {
    const tasks = await this.tasksRepository.find();
    const semesters = tasks.map((task) => task.semester);
    return semesters;
  }

  async checkDeadlines() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const now = `${year}-${month}-${day}`;
    const approachingDeadlines = await this.tasksRepository.find({
      where: {
        deadline: now,
      },
    });
    const approachingPersonalDeadlines =
      await this.personalTasksRepository.find({
        where: {
          deadline: now,
        },
      });
    if (
      approachingDeadlines.length === 0 ||
      approachingPersonalDeadlines.length === 0
    ) {
      console.log('no deadlines yet');
    }
    if (approachingDeadlines) {
      approachingDeadlines.forEach((task) => {
        const usernames = task.alloted_students;
        const mailTransporter = createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
            user: `${process.env.USER}`,
            pass: `${process.env.PASS}`,
          },
        });
        mailTransporter.sendMail(
          {
            from: `${process.env.USER}`,
            to: Array.isArray(usernames) ? usernames.join(',') : usernames,
            subject: `Deadline Approaching for Task ${task.task_name}`,
            html: `<html>
                  <body>
                    <h1>Make Sure To Complete the Tasks</h1>
                    <p>The Deadline is ${task.deadline}</p>
                  </body>
            </html>`,
          },
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log(
                `Mails Sent To ${task.alloted_students} For Deadline`,
              );
              return true;
            }
          },
        );
      });
    }
    if (approachingPersonalDeadlines) {
      approachingPersonalDeadlines.forEach((task) => {
        const usernames = task.alloted_user;
        const mailTransporter = createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          secure: false,
          auth: {
            user: `${process.env.USER}`,
            pass: `${process.env.PASS}`,
          },
        });
        mailTransporter.sendMail(
          {
            from: `${process.env.USER}`,
            to: Array.isArray(usernames) ? usernames.join(',') : usernames,
            subject: `Deadline Approaching for Task ${task.task_name}`,
            html: `<html>
                  <body>
                    <h1>Reminder To Complete the Tasks</h1>
                    <p>The Deadline is ${task.deadline}</p>
                  </body>
            </html>`,
          },
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`Mails Sent To ${task.alloted_user} For Deadline`);
              return true;
            }
          },
        );
      });
    }
  }

  async getPersonalTaskByName(task_name: string) {
    const task = await this.personalTasksRepository.findOne({
      where: { task_name },
    });
    if (task) {
      return task;
    }
  }

  async getPersonalTaskByNameUsername(task_name: string, username: string) {
    const task = await this.personalTasksRepository.findOne({
      where: { task_name, username },
    });
    if (task) {
      return task;
    }
  }

  async getTaskByName(name: string) {
    const task = await this.tasksRepository.findOne({
      where: { task_name: name },
    });
    if (task) {
      return task;
    }
  }

  async getTasksByTeacher(username: string) {
    if (username) {
      const teacher = await this.teacherService.getTeacher(username);
      if (teacher) {
        const tasks = this.tasksRepository.find({
          where: { teacher: teacher.teacher_name },
        });
        return tasks;
      } else {
        throw new Error('Teacher Not Found');
      }
    }
  }
}
