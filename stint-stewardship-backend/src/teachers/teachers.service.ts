/* eslint-disable prettier/prettier */
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teachers } from './teachers.entity';
import { Repository } from 'typeorm';
import { CreateTeachersInput } from './create-teacher.input';
import { v4 as uuid } from 'uuid';
import { createTransport } from 'nodemailer';
import { SubjectService } from 'src/subject/subject.service';
import { BroadcastInput } from './broadcast-student.input';
import { StudentsService } from 'src/students/students.service';
import { PersonalTasks } from 'src/tasks/perosonal.tasks.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { SwitchStatusInput } from './switchStatus.input';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teachers)
    private teachersRepository: Repository<Teachers>,
    private subjectService: SubjectService,
    @Inject(forwardRef(() => StudentsService))
    private studentService: StudentsService,
    @Inject(forwardRef(() => TasksService))
    private taskService: TasksService,
  ) {}

  async createTeacher(
    createTeacherInput: CreateTeachersInput,
  ): Promise<Teachers> {
    const { teacher_name, teacher_subject, username, password, subject_code } =
      createTeacherInput;
    const sub_sem = subject_code.toString().charAt(0);

    const subject = await this.subjectService.createSubject({
      sub_code: subject_code,
      sub_name: teacher_subject,
      sub_of_sem: parseInt(sub_sem),
    });
    if (subject) {
      const teacher = this.teachersRepository.create({
        teacher_id: uuid(),
        teacher_name,
        teacher_subject,
        subject_code,
        password,
        username,
        assigned_tasks: [],
        role: 'teacher',
        personalTasks: {
          todo: [],
          executing: [],
          completed: [],
          review: [],
          finished: [],
        },
      });

      if (teacher) {
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
            to: `${teacher.username}`,
            subject: 'New Teacher Created',
            html: `<html>
              <body>
                <h1>New Teacher Created</h1>
                <p>Greetings! ${teacher.teacher_name}</p>
              </body>
            </html>`,
          },
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Email Sent To New Teacher');
            }
          },
        );
      }
      return this.teachersRepository.save(teacher);
    }
  }

  async getTeachers(): Promise<Teachers[]> {
    return await this.teachersRepository.find();
  }

  async getTeacher(username: string): Promise<Teachers> {
    const teacher = await this.teachersRepository.findOne({
      where: {
        username,
      },
    });
    return teacher;
  }

  async getTeacherByName(name: string): Promise<Teachers> {
    const teacher = await this.teachersRepository.findOne({
      where: {
        teacher_name: name,
      },
    });
    return teacher;
  }

  async getTeacherBySub(subject: string) {
    const teacher = await this.teachersRepository.findOne({
      where: { teacher_subject: subject },
    });
    return teacher;
  }

  async broadcastBasedOnSem(broadcast: BroadcastInput) {
    const { name_of_teacher, message, semester } = broadcast;
    const teacher = await this.teachersRepository.findOne({
      where: { teacher_name: name_of_teacher },
    });
    const usernames = await this.studentService.getStudentUsernamesBySem(
      semester,
    );
    if (teacher) {
      const mailTransporter = createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
          user: `${process.env.USER}`,
          pass: `${process.env.PASS}`,
        },
      });

      if (usernames) {
        mailTransporter.sendMail(
          {
            from: `${process.env.USER}`,
            to: Array.isArray(usernames) ? usernames.join(',') : usernames,
            subject: `This is a Broadcast Message For all Students of Sem ${semester}`,
            html: `<html>
          <body>
            <h1>Message</h1>
            <p>Greetings! ${message}</p>
          </body>
        </html>`,
          },
          (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('The Broadcast Was Sent To All Students');
            }
          },
        );
        return `Message Sent to Students of Sem ${semester}`;
      }
      throw new Error(`No Students of sem ${semester} yet`);
    }
    throw new Error('Teacher Not Found');
  }

  async assignTeacherWithPersonalTask(task: PersonalTasks) {
    const teacher = await this.getTeacher(task.username);
    if (teacher) {
      teacher.assigned_tasks = [...teacher.assigned_tasks, task.task_name];
      teacher.personalTasks.todo = [
        ...teacher.personalTasks.todo,
        task.task_name,
      ];
      await this.teachersRepository.save(teacher);
    } else {
      throw new Error('Teacher Not Found');
    }
  }

  async removeTaskFromTeacher(task_name: string, username: string) {
    const personalTask = await this.taskService.getPersonalTaskByName(
      task_name,
    );
    if (personalTask) {
      const teacher = await this.getTeacher(username);
      const index = teacher.assigned_tasks.indexOf(personalTask.task_name);
      const indexintodo = teacher.personalTasks.todo.indexOf(
        personalTask.task_name,
      );
      const indexinexecuting = teacher.personalTasks.executing.indexOf(
        personalTask.task_name,
      );
      const indexincompleted = teacher.personalTasks.completed.indexOf(
        personalTask.task_name,
      );
      const indexinreview = teacher.personalTasks.review.indexOf(
        personalTask.task_name,
      );
      const indexinfinished = teacher.personalTasks.finished.indexOf(
        personalTask.task_name,
      );

      if (index !== -1) {
        teacher.assigned_tasks.splice(index, 1);
        await this.teachersRepository.update(teacher._id, {
          assigned_tasks: teacher.assigned_tasks,
        });
      }
      if (indexintodo !== -1) {
        teacher.personalTasks.todo.splice(indexintodo, 1);
        await this.teachersRepository.update(teacher._id, {
          personalTasks: {
            todo: teacher.personalTasks.todo,
            executing: [...teacher.personalTasks.executing],
            completed: [...teacher.personalTasks.completed],
            review: [...teacher.personalTasks.review],
            finished: [...teacher.personalTasks.finished],
          },
        });
      }
      if (indexinexecuting !== -1) {
        teacher.personalTasks.executing.splice(indexinexecuting, 1);
        await this.teachersRepository.update(teacher._id, {
          personalTasks: {
            todo: [...teacher.personalTasks.todo],
            executing: teacher.personalTasks.executing,
            completed: [...teacher.personalTasks.completed],
            review: [...teacher.personalTasks.review],
            finished: [...teacher.personalTasks.finished],
          },
        });
      }
      if (indexincompleted !== -1) {
        teacher.personalTasks.completed.splice(indexincompleted, 1);
        await this.teachersRepository.update(teacher._id, {
          personalTasks: {
            todo: [...teacher.personalTasks.todo],
            executing: [...teacher.personalTasks.executing],
            completed: teacher.personalTasks.completed,
            review: [...teacher.personalTasks.review],
            finished: [...teacher.personalTasks.finished],
          },
        });
      }
      if (indexinreview !== -1) {
        teacher.personalTasks.review.splice(indexinreview, 1);
        await this.teachersRepository.update(teacher._id, {
          personalTasks: {
            todo: [...teacher.personalTasks.todo],
            executing: [...teacher.personalTasks.executing],
            completed: [...teacher.personalTasks.completed],
            review: teacher.personalTasks.review,
            finished: [...teacher.personalTasks.finished],
          },
        });
      }
      if (indexinfinished !== -1) {
        teacher.personalTasks.finished.splice(indexinfinished, 1);
        await this.teachersRepository.update(teacher._id, {
          personalTasks: {
            todo: [...teacher.personalTasks.todo],
            executing: [...teacher.personalTasks.executing],
            completed: [...teacher.personalTasks.completed],
            review: [...teacher.personalTasks.review],
            finished: teacher.personalTasks.finished,
          },
        });
      }
    }
  }

  async moveTaskToExecution(
    moveToStatusInput: SwitchStatusInput,
  ): Promise<boolean> {
    const { task_name, teacher_username } = moveToStatusInput;
    const personalTask = await this.taskService.getPersonalTaskByName(
      task_name,
    );
    const teacher = await this.teachersRepository.findOne({
      where: { username: teacher_username },
    });
    if (teacher) {
      if (teacher.assigned_tasks.includes(task_name)) {
        if (personalTask) {
          const indexintodo = teacher.personalTasks.todo.indexOf(
            personalTask.task_name,
          );
          const indexincompleted = teacher.personalTasks.completed.indexOf(
            personalTask.task_name,
          );
          if (indexintodo !== -1) {
            teacher.personalTasks.todo.splice(indexintodo, 1);
            await this.teachersRepository.update(teacher._id, {
              personalTasks: {
                todo: teacher.personalTasks.todo,
                executing: [
                  ...teacher.personalTasks.executing,
                  personalTask.task_name,
                ],
                completed: [...teacher.personalTasks.completed],
                review: [...teacher.personalTasks.review],
                finished: [...teacher.personalTasks.finished],
              },
            });
            return true;
          } else if (indexincompleted !== -1) {
            teacher.personalTasks.completed.splice(indexincompleted, 1);
            await this.teachersRepository.update(teacher._id, {
              personalTasks: {
                todo: [...teacher.personalTasks.todo],
                executing: [
                  ...teacher.personalTasks.executing,
                  personalTask.task_name,
                ],
                completed: teacher.personalTasks.completed,
                review: [...teacher.personalTasks.review],
                finished: [...teacher.personalTasks.finished],
              },
            });
            return true;
          } else {
            return false;
          }
        } else {
          throw new Error('Task Not Found');
        }
      } else {
        throw new Error('This task is not for this teacher');
      }
    } else {
      throw new Error('Teacher Not Found');
    }
  }

  async moveTaskToCompleted(
    moveToStatusInput: SwitchStatusInput,
  ): Promise<boolean> {
    const { teacher_username, task_name } = moveToStatusInput;
    const personalTask = await this.taskService.getPersonalTaskByName(
      task_name,
    );
    const teacher = await this.teachersRepository.findOne({
      where: { username: teacher_username },
    });
    if (teacher) {
      if (teacher.assigned_tasks.includes(task_name)) {
        if (personalTask) {
          const indexintodo = teacher.personalTasks.todo.indexOf(
            personalTask.task_name,
          );
          const indexinexecuting = teacher.personalTasks.executing.indexOf(
            personalTask.task_name,
          );
          if (indexintodo !== -1) {
            teacher.personalTasks.todo.splice(indexintodo, 1);
            await this.teachersRepository.update(teacher._id, {
              personalTasks: {
                todo: teacher.personalTasks.todo,
                executing: [...teacher.personalTasks.executing],
                completed: [
                  ...teacher.personalTasks.completed,
                  personalTask.task_name,
                ],
                review: [...teacher.personalTasks.review],
                finished: [...teacher.personalTasks.finished],
              },
            });
            return true;
          } else if (indexinexecuting !== -1) {
            teacher.personalTasks.executing.splice(indexinexecuting, 1);
            await this.teachersRepository.update(teacher._id, {
              personalTasks: {
                todo: [...teacher.personalTasks.todo],
                executing: teacher.personalTasks.executing,
                completed: [
                  ...teacher.personalTasks.completed,
                  personalTask.task_name,
                ],
                review: [...teacher.personalTasks.review],
                finished: [...teacher.personalTasks.finished],
              },
            });
            return true;
          } else {
            return false;
          }
        } else {
          throw new Error('Task Not Found');
        }
      } else {
        throw new Error('This task is not for this teacher');
      }
    } else {
      throw new Error('Teacher Not Found');
    }
  }

  async moveTaskToTodo(moveToStatusInput: SwitchStatusInput): Promise<boolean> {
    const { teacher_username, task_name } = moveToStatusInput;
    const personalTask = await this.taskService.getPersonalTaskByName(
      task_name,
    );
    const teacher = await this.teachersRepository.findOne({
      where: { username: teacher_username },
    });
    if (teacher) {
      if (teacher.assigned_tasks.includes(task_name)) {
        if (personalTask) {
          const indexincompleted = teacher.personalTasks.completed.indexOf(
            personalTask.task_name,
          );
          const indexinexecuting = teacher.personalTasks.executing.indexOf(
            personalTask.task_name,
          );
          if (indexincompleted !== -1) {
            teacher.personalTasks.completed.splice(indexincompleted, 1);
            await this.teachersRepository.update(teacher._id, {
              personalTasks: {
                todo: [...teacher.personalTasks.todo, personalTask.task_name],
                executing: [...teacher.personalTasks.executing],
                completed: teacher.personalTasks.completed,
                review: [...teacher.personalTasks.review],
                finished: [...teacher.personalTasks.finished],
              },
            });
            return true;
          } else if (indexinexecuting !== -1) {
            teacher.personalTasks.executing.splice(indexinexecuting, 1);
            await this.teachersRepository.update(teacher._id, {
              personalTasks: {
                todo: [...teacher.personalTasks.todo, personalTask.task_name],
                executing: teacher.personalTasks.executing,
                completed: [...teacher.personalTasks.completed],
                review: [...teacher.personalTasks.review],
                finished: [...teacher.personalTasks.finished],
              },
            });
            return true;
          } else {
            return false;
          }
        } else {
          throw new Error('Task Not Found');
        }
      } else {
        throw new Error('This task is not for this teacher');
      }
    } else {
      throw new Error('Teacher Not Found');
    }
  }

  async movePersonalTaskToFinished(
    moveToStatusInput: SwitchStatusInput,
  ): Promise<boolean> {
    const { teacher_username, task_name } = moveToStatusInput;
    const personalTask = await this.taskService.getPersonalTaskByName(
      task_name,
    );
    const teacher = await this.teachersRepository.findOne({
      where: { username: teacher_username },
    });
    if (teacher) {
      if (teacher.assigned_tasks.includes(task_name)) {
        if (personalTask) {
          const indexincompleted = teacher.personalTasks.completed.indexOf(
            personalTask.task_name,
          );
          const indexinexecuting = teacher.personalTasks.executing.indexOf(
            personalTask.task_name,
          );
          const indexintodo = teacher.personalTasks.todo.indexOf(
            personalTask.task_name,
          );
          const indexinreview = teacher.personalTasks.review.indexOf(
            personalTask.task_name,
          );
          if (indexincompleted !== -1) {
            teacher.personalTasks.completed.splice(indexincompleted, 1);
            await this.teachersRepository.update(teacher._id, {
              personalTasks: {
                todo: [...teacher.personalTasks.todo],
                executing: [...teacher.personalTasks.executing],
                completed: teacher.personalTasks.completed,
                review: [...teacher.personalTasks.review],
                finished: [
                  ...teacher.personalTasks.finished,
                  personalTask.task_name,
                ],
              },
            });
            return true;
          } else if (indexinexecuting !== -1) {
            teacher.personalTasks.executing.splice(indexinexecuting, 1);
            await this.teachersRepository.update(teacher._id, {
              personalTasks: {
                todo: [...teacher.personalTasks.todo],
                executing: teacher.personalTasks.executing,
                completed: [...teacher.personalTasks.completed],
                review: [...teacher.personalTasks.review],
                finished: [
                  ...teacher.personalTasks.finished,
                  personalTask.task_name,
                ],
              },
            });
            return true;
          } else if (indexintodo !== -1) {
            teacher.personalTasks.todo.splice(indexintodo, 1);
            await this.teachersRepository.update(teacher._id, {
              personalTasks: {
                todo: teacher.personalTasks.todo,
                executing: [...teacher.personalTasks.executing],
                completed: [...teacher.personalTasks.completed],
                review: [...teacher.personalTasks.review],
                finished: [
                  ...teacher.personalTasks.finished,
                  personalTask.task_name,
                ],
              },
            });
            return true;
          } else if (indexinreview !== -1) {
            teacher.personalTasks.review.splice(indexinreview, 1);
            await this.teachersRepository.update(teacher._id, {
              personalTasks: {
                todo: [...teacher.personalTasks.todo],
                executing: [...teacher.personalTasks.executing],
                completed: [...teacher.personalTasks.completed],
                review: teacher.personalTasks.review,
                finished: [
                  ...teacher.personalTasks.finished,
                  personalTask.task_name,
                ],
              },
            });
            return true;
          } else {
            return false;
          }
        } else {
          throw new Error('Task Not Found');
        }
      } else {
        throw new Error('This task is not for this teacher');
      }
    } else {
      throw new Error('Student Not Found');
    }
  }

  async movePersonalTaskToReview(
    moveToStatusInput: SwitchStatusInput,
  ): Promise<boolean> {
    const { teacher_username, task_name } = moveToStatusInput;
    const personalTask = await this.taskService.getPersonalTaskByName(
      task_name,
    );
    const teacher = await this.teachersRepository.findOne({
      where: { username: teacher_username },
    });
    if (teacher) {
      const indexincompleted =
        teacher.personalTasks.completed.indexOf(task_name);
      const indexinexecuting =
        teacher.personalTasks.executing.indexOf(task_name);
      const indexintodo = teacher.personalTasks.todo.indexOf(task_name);
      const indexinfinished = teacher.personalTasks.finished.indexOf(task_name);
      if (teacher.assigned_tasks.includes(task_name)) {
        if (personalTask) {
          if (indexincompleted !== -1) {
            teacher.personalTasks.completed.splice(indexincompleted, 1);
            await this.teachersRepository.update(teacher._id, {
              personalTasks: {
                todo: [...teacher.personalTasks.todo],
                executing: [...teacher.personalTasks.executing],
                completed: teacher.personalTasks.completed,
                review: [
                  ...teacher.personalTasks.review,
                  personalTask.task_name,
                ],
                finished: [...teacher.personalTasks.finished],
              },
            });
            return true;
          } else if (indexinexecuting !== -1) {
            teacher.personalTasks.executing.splice(indexinexecuting, 1);
            await this.teachersRepository.update(teacher._id, {
              personalTasks: {
                todo: [...teacher.personalTasks.todo],
                executing: teacher.personalTasks.executing,
                completed: [...teacher.personalTasks.completed],
                review: [
                  ...teacher.personalTasks.review,
                  personalTask.task_name,
                ],
                finished: [...teacher.personalTasks.finished],
              },
            });
            return true;
          } else if (indexintodo !== -1) {
            teacher.personalTasks.todo.splice(indexintodo, 1);
            await this.teachersRepository.update(teacher._id, {
              personalTasks: {
                todo: teacher.personalTasks.todo,
                executing: [...teacher.personalTasks.executing],
                completed: [...teacher.personalTasks.completed],
                review: [
                  ...teacher.personalTasks.review,
                  personalTask.task_name,
                ],
                finished: [...teacher.personalTasks.finished],
              },
            });
            return true;
          } else if (indexinfinished !== -1) {
            teacher.personalTasks.finished.splice(indexinfinished, 1);
            await this.teachersRepository.update(teacher._id, {
              personalTasks: {
                todo: [...teacher.personalTasks.todo],
                executing: [...teacher.personalTasks.executing],
                completed: [...teacher.personalTasks.completed],
                review: [
                  ...teacher.personalTasks.review,
                  personalTask.task_name,
                ],
                finished: teacher.personalTasks.finished,
              },
            });
            return true;
          } else {
            return false;
          }
        } else {
          throw new Error('Task Not Found');
        }
      } else {
        throw new Error('This task is not for this teacher');
      }
    } else {
      throw new Error('Student Not Found');
    }
  }

  async getAllTeacherTodo(username: string) {
    const teacher = await this.getTeacher(username);
    if (teacher) {
      const todo = teacher.personalTasks.todo.map(async (task) => {
        return await this.taskService.searchPersonalTaskByName(task);
      });
      return todo;
    } else {
      return null;
    }
  }

  async getAllTeacherExecuting(username: string) {
    const teacher = await this.getTeacher(username);
    if (teacher) {
      const todo = teacher.personalTasks.executing.map(async (task) => {
        return await this.taskService.searchPersonalTaskByName(task);
      });
      return todo;
    } else {
      return null;
    }
  }

  async getAllTeacherCompletedList(username: string) {
    const teacher = await this.getTeacher(username);
    if (teacher) {
      const todo = teacher.personalTasks.completed.map(async (task) => {
        return await this.taskService.searchPersonalTaskByName(task);
      });
      return todo;
    } else {
      return null;
    }
  }

  async getAllTeacherReviewList(username: string) {
    const teacher = await this.getTeacher(username);
    if (teacher) {
      const todo = teacher.personalTasks.review.map(async (task) => {
        return await this.taskService.searchPersonalTaskByName(task);
      });
      return todo;
    } else {
      return null;
    }
  }

  async getAllTeacherFinishedList(username: string) {
    const teacher = await this.getTeacher(username);
    if (teacher) {
      const todo = teacher.personalTasks.finished.map(async (task) => {
        return await this.taskService.searchPersonalTaskByName(task);
      });
      return todo;
    } else {
      return null;
    }
  }

  async getRecentTeacher(username: string) {
    const teacher = await this.getTeacher(username);
    if (teacher) {
      const recent = teacher.assigned_tasks.map((tasks) => {
        return tasks;
      });
      return recent.reverse().slice(0, 5);
    }
  }

  async getCountOfTeacherPersonalTasks(username: string) {
    const teacher = await this.getTeacher(username);
    if (teacher) {
      let num = 0;
      teacher.personalTasks.todo.map(() => {
        num++;
      });
      const todo = num;
      num = 0;
      teacher.personalTasks.executing.map(() => {
        num++;
      });
      const executing = num;
      num = 0;
      teacher.personalTasks.completed.map(() => {
        num++;
      });
      const completed = num;
      num = 0;
      teacher.personalTasks.review.map(() => {
        num++;
      });
      const review = num;
      num = 0;
      teacher.personalTasks.finished.map(() => {
        num++;
      });
      const finished = num;
      return [todo, executing, completed, review, finished];
    }
  }
}
