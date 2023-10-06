"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const students_entity_1 = require("./students.entity");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const nodemailer_1 = require("nodemailer");
const tasks_service_1 = require("../tasks/tasks.service");
const file_entity_1 = require("./file.entity");
const teachers_service_1 = require("../teachers/teachers.service");
let StudentsService = class StudentsService {
    constructor(studentRepository, fileRepository, taskService, teacherService) {
        this.studentRepository = studentRepository;
        this.fileRepository = fileRepository;
        this.taskService = taskService;
        this.teacherService = teacherService;
    }
    async getUsernameById(id) {
        const student = await this.studentRepository.findOne({
            where: {
                stud_id: id,
            },
        });
        if (student) {
            return student.username;
        }
        else {
            return null;
        }
    }
    async createStudent(createStudentInput) {
        const { stud_name, stud_roll, username, password, semester } = createStudentInput;
        const tasks_id = await this.taskService.getTasksBySem(semester);
        const student = this.studentRepository.create({
            stud_id: (0, uuid_1.v4)(),
            stud_name,
            stud_roll,
            username,
            password,
            semester,
            tasks: tasks_id || [],
            comment: [],
            role: 'student',
            taskwithstatus: {
                todo: tasks_id || [],
                executing: [],
                completed: [],
                review: [],
                finished: [],
            },
            personalTasks: {
                todo: [],
                executing: [],
                completed: [],
                review: [],
                finished: [],
            },
        });
        if (student) {
            const mailTransporter = (0, nodemailer_1.createTransport)({
                service: 'gmail',
                host: 'smtp.gmail.com',
                secure: false,
                auth: {
                    user: `${process.env.USER}`,
                    pass: `${process.env.PASS}`,
                },
            });
            mailTransporter.sendMail({
                from: `${process.env.USER}`,
                to: `${student.username}`,
                subject: 'New Student Created',
                html: `<html>
            <body>
              <h1>New Student Created</h1>
              <p>Hello! ${student.stud_name}</p>
            </body>
          </html>`,
            }, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Mail Sent To New Registered Student');
                }
            });
        }
        await this.taskService.assignTasksToNewStudent(student);
        return await this.studentRepository.save(student);
    }
    async getStudentsIdsBySem(semester) {
        const students = await this.studentRepository.find({
            where: { semester },
        });
        return students.map((student) => student.stud_id);
    }
    async getStudents() {
        return await this.studentRepository.find();
    }
    async getStudent(username) {
        const student = await this.studentRepository.findOne({
            where: { username },
        });
        return student;
    }
    async getStudentsBySemester(semester) {
        return this.studentRepository.find({ where: { semester } });
    }
    async assignStudentsWithTask(task) {
        if (task.alloted_students) {
            const students = await this.getStudentsBySemester(task.semester);
            students.map((student) => ((student.tasks = [...student.tasks, task.task_name]),
                (student.taskwithstatus.todo = [
                    ...student.taskwithstatus.todo,
                    task.task_name,
                ])));
            await this.studentRepository.save(students);
        }
    }
    async assignStudentWithPersonalTask(task) {
        const personalTask = await this.taskService.getPersonalTaskByName(task.task_name);
        if (personalTask) {
            const student = await this.getStudent(task.username);
            if (student) {
                student.tasks = [...student.tasks, task.task_name];
                student.personalTasks.todo = [
                    ...student.personalTasks.todo,
                    task.task_name,
                ];
                await this.studentRepository.save(student);
            }
            else {
                throw new Error('Student Not Found');
            }
        }
        else {
            throw new Error('Personal Task Not Found');
        }
    }
    async getStudentUsernamesBySem(semester) {
        const students = await this.studentRepository.find({ where: { semester } });
        const usernames = students.map((student) => student.username);
        return usernames;
    }
    async removeTaskFromStudent(name) {
        const students = await this.studentRepository.find({
            where: { tasks: name },
        });
        const task = await this.taskService.getTaskByName(name);
        if (task) {
            for (const student of students) {
                const index = student.tasks.indexOf(name);
                const indexintodo = student.taskwithstatus.todo.indexOf(name);
                const indexinexecuting = student.taskwithstatus.executing.indexOf(name);
                const indexincompleted = student.taskwithstatus.completed.indexOf(name);
                const indexinreview = student.taskwithstatus.review.indexOf(name);
                const indexinfinished = student.taskwithstatus.finished.indexOf(name);
                if (index !== -1) {
                    student.tasks.splice(index, 1);
                    await this.studentRepository.update(student._id, {
                        tasks: student.tasks,
                    });
                }
                if (indexintodo !== -1) {
                    student.taskwithstatus.todo.splice(indexintodo, 1);
                    await this.studentRepository.update(student._id, {
                        taskwithstatus: {
                            todo: student.taskwithstatus.todo,
                            executing: [...student.taskwithstatus.executing],
                            completed: [...student.taskwithstatus.completed],
                            review: [...student.taskwithstatus.review],
                            finished: [...student.taskwithstatus.finished],
                        },
                    });
                }
                if (indexinexecuting !== -1) {
                    student.taskwithstatus.executing.splice(indexinexecuting, 1);
                    await this.studentRepository.update(student._id, {
                        taskwithstatus: {
                            todo: [...student.taskwithstatus.todo],
                            executing: student.taskwithstatus.executing,
                            completed: [...student.taskwithstatus.completed],
                            review: [...student.taskwithstatus.review],
                            finished: [...student.taskwithstatus.finished],
                        },
                    });
                }
                if (indexincompleted !== -1) {
                    student.taskwithstatus.completed.splice(indexincompleted, 1);
                    await this.studentRepository.update(student._id, {
                        taskwithstatus: {
                            todo: [...student.taskwithstatus.todo],
                            executing: [...student.taskwithstatus.executing],
                            completed: student.taskwithstatus.completed,
                            review: [...student.taskwithstatus.review],
                            finished: [...student.taskwithstatus.finished],
                        },
                    });
                }
                if (indexinreview !== -1) {
                    student.taskwithstatus.review.splice(indexinreview, 1);
                    await this.studentRepository.update(student._id, {
                        taskwithstatus: {
                            todo: [...student.taskwithstatus.todo],
                            executing: [...student.taskwithstatus.executing],
                            completed: [...student.taskwithstatus.completed],
                            review: student.taskwithstatus.review,
                            finished: [...student.taskwithstatus.finished],
                        },
                    });
                }
                if (indexinfinished !== -1) {
                    student.taskwithstatus.finished.splice(indexinfinished, 1);
                    await this.studentRepository.update(student._id, {
                        taskwithstatus: {
                            todo: [...student.taskwithstatus.todo],
                            executing: [...student.taskwithstatus.executing],
                            completed: [...student.taskwithstatus.completed],
                            review: [...student.taskwithstatus.review],
                            finished: student.taskwithstatus.finished,
                        },
                    });
                }
            }
        }
    }
    async removePersonalTaskFromStudents(name, username) {
        const personalTask = await this.taskService.getPersonalTaskByNameUsername(name, username);
        if (personalTask) {
            const student = await this.getStudent(username);
            const index = student.tasks.indexOf(personalTask.task_name);
            const indexintodo = student.personalTasks.todo.indexOf(name);
            const indexinexecuting = student.personalTasks.executing.indexOf(name);
            const indexincompleted = student.personalTasks.completed.indexOf(name);
            const indexinreview = student.personalTasks.review.indexOf(name);
            const indexinfinished = student.personalTasks.finished.indexOf(name);
            if (index !== -1) {
                student.tasks.splice(index, 1);
                await this.studentRepository.update(student._id, {
                    tasks: student.tasks,
                });
            }
            if (indexintodo !== -1) {
                student.personalTasks.todo.splice(indexintodo, 1);
                await this.studentRepository.update(student._id, {
                    personalTasks: {
                        todo: student.personalTasks.todo,
                        executing: [...student.personalTasks.executing],
                        completed: [...student.personalTasks.completed],
                        review: [...student.personalTasks.review],
                        finished: [...student.personalTasks.finished],
                    },
                });
            }
            if (indexinexecuting !== -1) {
                student.personalTasks.executing.splice(indexinexecuting, 1);
                await this.studentRepository.update(student._id, {
                    personalTasks: {
                        todo: [...student.personalTasks.todo],
                        executing: student.personalTasks.executing,
                        completed: [...student.personalTasks.completed],
                        review: [...student.personalTasks.review],
                        finished: [...student.personalTasks.finished],
                    },
                });
            }
            if (indexincompleted !== -1) {
                student.personalTasks.completed.splice(indexincompleted, 1);
                await this.studentRepository.update(student._id, {
                    personalTasks: {
                        todo: [...student.personalTasks.todo],
                        executing: [...student.personalTasks.executing],
                        completed: student.personalTasks.completed,
                        review: [...student.personalTasks.review],
                        finished: [...student.personalTasks.finished],
                    },
                });
            }
            if (indexinreview !== -1) {
                student.personalTasks.review.splice(indexinreview, 1);
                await this.studentRepository.update(student._id, {
                    personalTasks: {
                        todo: [...student.personalTasks.todo],
                        executing: [...student.personalTasks.executing],
                        completed: [...student.personalTasks.completed],
                        review: student.personalTasks.review,
                        finished: [...student.personalTasks.finished],
                    },
                });
            }
            if (indexinfinished !== -1) {
                student.personalTasks.finished.splice(indexinfinished, 1);
                await this.studentRepository.update(student._id, {
                    personalTasks: {
                        todo: [...student.personalTasks.todo],
                        executing: [...student.personalTasks.executing],
                        completed: [...student.personalTasks.completed],
                        review: [...student.personalTasks.review],
                        finished: student.personalTasks.finished,
                    },
                });
            }
        }
    }
    async moveTaskToExecution(moveToStatusInput) {
        const { task_name, student_roll } = moveToStatusInput;
        const student = await this.studentRepository.findOne({
            where: { stud_roll: student_roll },
        });
        const task = await this.taskService.searchTaskByName(task_name);
        if (student) {
            if (student.tasks.includes(task_name)) {
                if (task) {
                    const teacher = await this.teacherService.getTeacherByName(task.teacher);
                    const indexintodo = student.taskwithstatus.todo.indexOf(task_name);
                    const indexincompleted = student.taskwithstatus.completed.indexOf(task_name);
                    if (indexintodo !== -1) {
                        student.taskwithstatus.todo.splice(indexintodo, 1);
                        await this.studentRepository.update(student._id, {
                            taskwithstatus: {
                                todo: student.taskwithstatus.todo,
                                executing: [
                                    ...student.taskwithstatus.executing,
                                    task.task_name,
                                ],
                                completed: [...student.taskwithstatus.completed],
                                review: [...student.taskwithstatus.review],
                                finished: [...student.taskwithstatus.finished],
                            },
                        });
                        const mailTransporter = (0, nodemailer_1.createTransport)({
                            service: 'gmail',
                            host: 'smtp.gmail.com',
                            secure: false,
                            auth: {
                                user: `${process.env.USER}`,
                                pass: `${process.env.PASS}`,
                            },
                        });
                        mailTransporter.sendMail({
                            from: `${process.env.USER}`,
                            to: `${teacher.username}`,
                            subject: 'Student Executing a task',
                            html: `<html>
                  <body>
                    <h3>Greetings ${teacher.teacher_name}</h3>
                    <p>${student.stud_name} with roll number ${student.stud_roll} is executing task ${task.task_name} now</p>
                  </body>
                </html>`,
                        }, (err) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log('Mail Sent for switching task');
                            }
                        });
                        return true;
                    }
                    else if (indexincompleted !== -1) {
                        student.taskwithstatus.completed.splice(indexincompleted, 1);
                        await this.studentRepository.update(student._id, {
                            taskwithstatus: {
                                todo: [...student.taskwithstatus.todo],
                                executing: [
                                    ...student.taskwithstatus.executing,
                                    task.task_name,
                                ],
                                completed: student.taskwithstatus.completed,
                                review: [...student.taskwithstatus.review],
                                finished: [...student.taskwithstatus.finished],
                            },
                        });
                        const mailTransporter = (0, nodemailer_1.createTransport)({
                            service: 'gmail',
                            host: 'smtp.gmail.com',
                            secure: false,
                            auth: {
                                user: `${process.env.USER}`,
                                pass: `${process.env.PASS}`,
                            },
                        });
                        mailTransporter.sendMail({
                            from: `${process.env.USER}`,
                            to: `${teacher.username}`,
                            subject: 'Student Executing a task',
                            html: `<html>
                  <body>
                    <h3>Greetings ${teacher.teacher_name}</h3>
                    <p>${student.stud_name} with roll number ${student.stud_roll} is executing task ${task.task_name} now</p>
                  </body>
                </html>`,
                        }, (err) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log('Mail Sent for switching task');
                            }
                        });
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    throw new Error('Task Not Found');
                }
            }
            else {
                throw new Error('This task is not for this student');
            }
        }
        else {
            throw new Error('Student Not Found');
        }
    }
    async movePersonalTaskToExecution(moveToStateInput) {
        const { student_roll, task_name } = moveToStateInput;
        const student = await this.studentRepository.findOne({
            where: { stud_roll: student_roll },
        });
        if (student) {
            const personalTask = await this.taskService.getPersonalTaskByNameUsername(task_name, student.username);
            if (student.tasks.includes(task_name)) {
                if (personalTask) {
                    const indexintodo = student.personalTasks.todo.indexOf(personalTask.task_name);
                    const indexincompleted = student.personalTasks.completed.indexOf(personalTask.task_name);
                    if (indexintodo !== -1) {
                        student.personalTasks.todo.splice(indexintodo, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: student.personalTasks.todo,
                                executing: [
                                    ...student.personalTasks.executing,
                                    personalTask.task_name,
                                ],
                                completed: [...student.personalTasks.completed],
                                review: [...student.personalTasks.review],
                                finished: [...student.personalTasks.finished],
                            },
                        });
                        return true;
                    }
                    else if (indexincompleted !== -1) {
                        student.personalTasks.completed.splice(indexincompleted, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: [...student.personalTasks.todo],
                                executing: [
                                    ...student.personalTasks.executing,
                                    personalTask.task_name,
                                ],
                                completed: student.personalTasks.completed,
                                review: [...student.personalTasks.review],
                                finished: [...student.personalTasks.finished],
                            },
                        });
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    throw new Error(`Personal Task of Task Name: ${task_name} Not Found`);
                }
            }
            else {
                throw new Error('This task is not for this student');
            }
        }
        else {
            throw new Error(`Student of Roll Number: ${student_roll} Not Found`);
        }
    }
    async moveTaskToCompleted(moveToStatusInput) {
        const { student_roll, task_name } = moveToStatusInput;
        const task = await this.taskService.searchTaskByName(task_name);
        const personalTask = await this.taskService.getPersonalTaskByName(task_name);
        const student = await this.studentRepository.findOne({
            where: { stud_roll: student_roll },
        });
        if (student) {
            if (student.tasks.includes(task_name)) {
                if (task) {
                    const teacher = await this.teacherService.getTeacherByName(task.teacher);
                    const indexintodo = student.taskwithstatus.todo.indexOf(task_name);
                    const indexinexecuting = student.taskwithstatus.executing.indexOf(task_name);
                    if (indexintodo !== -1) {
                        student.taskwithstatus.todo.splice(indexintodo, 1);
                        await this.studentRepository.update(student._id, {
                            taskwithstatus: {
                                todo: student.taskwithstatus.todo,
                                executing: [...student.taskwithstatus.executing],
                                completed: [
                                    ...student.taskwithstatus.completed,
                                    task.task_name,
                                ],
                                review: [...student.taskwithstatus.review],
                                finished: [...student.taskwithstatus.finished],
                            },
                        });
                        const mailTransporter = (0, nodemailer_1.createTransport)({
                            service: 'gmail',
                            host: 'smtp.gmail.com',
                            secure: false,
                            auth: {
                                user: `${process.env.USER}`,
                                pass: `${process.env.PASS}`,
                            },
                        });
                        mailTransporter.sendMail({
                            from: `${process.env.USER}`,
                            to: `${teacher.username}`,
                            subject: 'Student Completed a task',
                            html: `<html>
                  <body>
                    <h3>Greetings ${teacher.teacher_name}</h3>
                    <p>${student.stud_name} with roll number ${student.stud_roll} has completed task ${task.task_name}</p>
                    <p>The Task Was Completed At: ${new Date().toLocaleString()}</p>
                  </body>
                </html>`,
                        }, (err) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log('Mail Sent for switching task');
                            }
                        });
                        return true;
                    }
                    else if (indexinexecuting !== -1) {
                        student.taskwithstatus.executing.splice(indexinexecuting, 1);
                        await this.studentRepository.update(student._id, {
                            taskwithstatus: {
                                todo: [...student.taskwithstatus.todo],
                                executing: student.taskwithstatus.executing,
                                completed: [
                                    ...student.taskwithstatus.completed,
                                    task.task_name,
                                ],
                                review: [...student.taskwithstatus.review],
                                finished: [...student.taskwithstatus.finished],
                            },
                        });
                        const mailTransporter = (0, nodemailer_1.createTransport)({
                            service: 'gmail',
                            host: 'smtp.gmail.com',
                            secure: false,
                            auth: {
                                user: `${process.env.USER}`,
                                pass: `${process.env.PASS}`,
                            },
                        });
                        mailTransporter.sendMail({
                            from: `${process.env.USER}`,
                            to: `${teacher.username}`,
                            subject: 'Student Completed a task',
                            html: `<html>
                  <body>
                    <h3>Greetings ${teacher.teacher_name}</h3>
                    <p>${student.stud_name} with roll number ${student.stud_roll} has completed task ${task.task_name}</p>
                    <p>The Task Was Completed At: ${new Date().toLocaleString()}</p>
                  </body>
                </html>`,
                        }, (err) => {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log('Mail Sent for switching task');
                            }
                        });
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else if (personalTask) {
                    const indexintodo = student.personalTasks.todo.indexOf(personalTask.task_name);
                    const indexinexecuting = student.personalTasks.executing.indexOf(personalTask.task_name);
                    if (indexintodo !== -1) {
                        student.personalTasks.todo.splice(indexintodo, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: student.personalTasks.todo,
                                executing: [...student.personalTasks.executing],
                                completed: [
                                    ...student.personalTasks.completed,
                                    personalTask.task_name,
                                ],
                                review: [...student.personalTasks.review],
                                finished: [...student.personalTasks.finished],
                            },
                        });
                        return true;
                    }
                    else if (indexinexecuting !== -1) {
                        student.personalTasks.executing.splice(indexinexecuting, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: [...student.personalTasks.todo],
                                executing: student.personalTasks.executing,
                                completed: [
                                    ...student.personalTasks.completed,
                                    personalTask.task_name,
                                ],
                                review: [...student.personalTasks.review],
                                finished: [...student.personalTasks.finished],
                            },
                        });
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    throw new Error('Task Not Found');
                }
            }
            else {
                throw new Error('This task is not for this student');
            }
        }
        else {
            throw new Error('Student Not Found');
        }
    }
    async movePersonalTaskToCompleted(moveToStatusInput) {
        const { student_roll, task_name } = moveToStatusInput;
        const student = await this.studentRepository.findOne({
            where: { stud_roll: student_roll },
        });
        if (student) {
            const personalTask = await this.taskService.getPersonalTaskByNameUsername(task_name, student.username);
            if (student.tasks.includes(task_name)) {
                if (personalTask) {
                    const indexintodo = student.personalTasks.todo.indexOf(personalTask.task_name);
                    const indexinexecuting = student.personalTasks.executing.indexOf(personalTask.task_name);
                    if (indexintodo !== -1) {
                        student.personalTasks.todo.splice(indexintodo, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: student.personalTasks.todo,
                                executing: [...student.personalTasks.executing],
                                completed: [
                                    ...student.personalTasks.completed,
                                    personalTask.task_name,
                                ],
                                review: [...student.personalTasks.review],
                                finished: [...student.personalTasks.finished],
                            },
                        });
                        return true;
                    }
                    else if (indexinexecuting !== -1) {
                        student.personalTasks.executing.splice(indexinexecuting, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: [...student.personalTasks.todo],
                                executing: student.personalTasks.executing,
                                completed: [
                                    ...student.personalTasks.completed,
                                    personalTask.task_name,
                                ],
                                review: [...student.personalTasks.review],
                                finished: [...student.personalTasks.finished],
                            },
                        });
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    throw new Error('Task Not Found');
                }
            }
            else {
                throw new Error('This task is not for this student');
            }
        }
        else {
            throw new Error('Student Not Found');
        }
    }
    async moveTaskToTodo(moveToStatusInput) {
        const { student_roll, task_name } = moveToStatusInput;
        const task = await this.taskService.searchTaskByName(task_name);
        const personalTask = await this.taskService.getPersonalTaskByName(task_name);
        const student = await this.studentRepository.findOne({
            where: { stud_roll: student_roll },
        });
        if (student) {
            if (student.tasks.includes(task_name)) {
                if (task) {
                    const indexincompleted = student.taskwithstatus.completed.indexOf(task_name);
                    const indexinexecuting = student.taskwithstatus.executing.indexOf(task_name);
                    if (indexincompleted !== -1) {
                        student.taskwithstatus.completed.splice(indexincompleted, 1);
                        await this.studentRepository.update(student._id, {
                            taskwithstatus: {
                                todo: [...student.taskwithstatus.todo, task.task_name],
                                executing: [...student.taskwithstatus.executing],
                                completed: student.taskwithstatus.completed,
                                review: [...student.taskwithstatus.review],
                                finished: [...student.taskwithstatus.finished],
                            },
                        });
                        return true;
                    }
                    else if (indexinexecuting !== -1) {
                        student.taskwithstatus.executing.splice(indexinexecuting, 1);
                        await this.studentRepository.update(student._id, {
                            taskwithstatus: {
                                todo: [...student.taskwithstatus.todo, task.task_name],
                                executing: student.taskwithstatus.executing,
                                completed: [...student.taskwithstatus.completed],
                                review: [...student.taskwithstatus.review],
                                finished: [...student.taskwithstatus.finished],
                            },
                        });
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else if (personalTask) {
                    const indexincompleted = student.personalTasks.completed.indexOf(personalTask.task_name);
                    const indexinexecuting = student.personalTasks.executing.indexOf(personalTask.task_name);
                    if (indexincompleted !== -1) {
                        student.personalTasks.completed.splice(indexincompleted, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: [...student.personalTasks.todo, personalTask.task_name],
                                executing: [...student.personalTasks.executing],
                                completed: student.personalTasks.completed,
                                review: [...student.personalTasks.review],
                                finished: [...student.personalTasks.finished],
                            },
                        });
                        return true;
                    }
                    else if (indexinexecuting !== -1) {
                        student.personalTasks.executing.splice(indexinexecuting, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: [...student.personalTasks.todo, personalTask.task_name],
                                executing: student.personalTasks.executing,
                                completed: [...student.personalTasks.completed],
                                review: [...student.personalTasks.review],
                                finished: [...student.personalTasks.finished],
                            },
                        });
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    throw new Error('Task Not Found');
                }
            }
            else {
                throw new Error('This task is not for this student');
            }
        }
        else {
            throw new Error('Student Not Found');
        }
    }
    async movePersonalTaskToTodo(moveToStatusInput) {
        const { student_roll, task_name } = moveToStatusInput;
        const student = await this.studentRepository.findOne({
            where: { stud_roll: student_roll },
        });
        if (student) {
            const personalTask = await this.taskService.getPersonalTaskByNameUsername(task_name, student.username);
            if (student.tasks.includes(task_name)) {
                if (personalTask) {
                    const indexincompleted = student.personalTasks.completed.indexOf(personalTask.task_name);
                    const indexinexecuting = student.personalTasks.executing.indexOf(personalTask.task_name);
                    if (indexincompleted !== -1) {
                        student.personalTasks.completed.splice(indexincompleted, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: [...student.personalTasks.todo, personalTask.task_name],
                                executing: [...student.personalTasks.executing],
                                completed: student.personalTasks.completed,
                                review: [...student.personalTasks.review],
                                finished: [...student.personalTasks.finished],
                            },
                        });
                        return true;
                    }
                    else if (indexinexecuting !== -1) {
                        student.personalTasks.executing.splice(indexinexecuting, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: [...student.personalTasks.todo, personalTask.task_name],
                                executing: student.personalTasks.executing,
                                completed: [...student.personalTasks.completed],
                                review: [...student.personalTasks.review],
                                finished: [...student.personalTasks.finished],
                            },
                        });
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    throw new Error('Task Not Found');
                }
            }
            else {
                throw new Error('This task is not for this student');
            }
        }
        else {
            throw new Error('Student Not Found');
        }
    }
    async moveTaskToFinished(moveToStatusInput) {
        const { student_roll, task_name } = moveToStatusInput;
        const task = await this.taskService.searchTaskByName(task_name);
        const student = await this.studentRepository.findOne({
            where: { stud_roll: student_roll },
        });
        if (student) {
            if (student.tasks.includes(task_name)) {
                if (task) {
                    const indexincompleted = student.taskwithstatus.completed.indexOf(task_name);
                    const indexinexecuting = student.taskwithstatus.executing.indexOf(task_name);
                    const indexintodo = student.taskwithstatus.todo.indexOf(task_name);
                    const indexinreview = student.taskwithstatus.review.indexOf(task_name);
                    if (indexincompleted !== -1) {
                        student.taskwithstatus.completed.splice(indexincompleted, 1);
                        await this.studentRepository.update(student._id, {
                            taskwithstatus: {
                                todo: [...student.taskwithstatus.todo],
                                executing: [...student.taskwithstatus.executing],
                                completed: student.taskwithstatus.completed,
                                review: [...student.taskwithstatus.review],
                                finished: [...student.taskwithstatus.finished, task.task_name],
                            },
                        });
                        return true;
                    }
                    else if (indexinexecuting !== -1) {
                        student.taskwithstatus.executing.splice(indexinexecuting, 1);
                        await this.studentRepository.update(student._id, {
                            taskwithstatus: {
                                todo: [...student.taskwithstatus.todo],
                                executing: student.taskwithstatus.executing,
                                completed: [...student.taskwithstatus.completed],
                                review: [...student.taskwithstatus.review],
                                finished: [...student.taskwithstatus.finished, task.task_name],
                            },
                        });
                        return true;
                    }
                    else if (indexintodo !== -1) {
                        student.taskwithstatus.todo.splice(indexintodo, 1);
                        await this.studentRepository.update(student._id, {
                            taskwithstatus: {
                                todo: student.taskwithstatus.todo,
                                executing: [...student.taskwithstatus.executing],
                                completed: [...student.taskwithstatus.completed],
                                review: [...student.taskwithstatus.review],
                                finished: [...student.taskwithstatus.finished, task.task_name],
                            },
                        });
                        return true;
                    }
                    else if (indexinreview !== -1) {
                        student.taskwithstatus.review.splice(indexinreview, 1);
                        await this.studentRepository.update(student._id, {
                            taskwithstatus: {
                                todo: [...student.taskwithstatus.todo],
                                executing: [...student.taskwithstatus.executing],
                                completed: [...student.taskwithstatus.completed],
                                review: student.taskwithstatus.review,
                                finished: [...student.taskwithstatus.finished, task.task_name],
                            },
                        });
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    throw new Error('Task Not Found');
                }
            }
            else {
                throw new Error('This task is not for this student');
            }
        }
        else {
            throw new Error('Student Not Found');
        }
    }
    async movePersonalTaskToFinished(moveToStatusInput) {
        const { student_roll, task_name } = moveToStatusInput;
        const personalTask = await this.taskService.getPersonalTaskByName(task_name);
        const student = await this.studentRepository.findOne({
            where: { stud_roll: student_roll },
        });
        if (student) {
            if (student.tasks.includes(task_name)) {
                if (personalTask) {
                    const indexincompleted = student.personalTasks.completed.indexOf(personalTask.task_name);
                    const indexinexecuting = student.personalTasks.executing.indexOf(personalTask.task_name);
                    const indexintodo = student.personalTasks.todo.indexOf(personalTask.task_name);
                    const indexinreview = student.personalTasks.review.indexOf(personalTask.task_name);
                    if (indexincompleted !== -1) {
                        student.personalTasks.completed.splice(indexincompleted, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: [...student.personalTasks.todo],
                                executing: [...student.personalTasks.executing],
                                completed: student.personalTasks.completed,
                                review: [...student.personalTasks.review],
                                finished: [
                                    ...student.personalTasks.finished,
                                    personalTask.task_name,
                                ],
                            },
                        });
                        return true;
                    }
                    else if (indexinexecuting !== -1) {
                        student.personalTasks.executing.splice(indexinexecuting, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: [...student.personalTasks.todo],
                                executing: student.personalTasks.executing,
                                completed: [...student.personalTasks.completed],
                                review: [...student.personalTasks.review],
                                finished: [
                                    ...student.personalTasks.finished,
                                    personalTask.task_name,
                                ],
                            },
                        });
                        return true;
                    }
                    else if (indexintodo !== -1) {
                        student.personalTasks.todo.splice(indexintodo, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: student.personalTasks.todo,
                                executing: [...student.personalTasks.executing],
                                completed: [...student.personalTasks.completed],
                                review: [...student.personalTasks.review],
                                finished: [
                                    ...student.personalTasks.finished,
                                    personalTask.task_name,
                                ],
                            },
                        });
                        return true;
                    }
                    else if (indexinreview !== -1) {
                        student.personalTasks.review.splice(indexinreview, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: [...student.personalTasks.todo],
                                executing: [...student.personalTasks.executing],
                                completed: [...student.personalTasks.completed],
                                review: student.personalTasks.review,
                                finished: [
                                    ...student.personalTasks.finished,
                                    personalTask.task_name,
                                ],
                            },
                        });
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    throw new Error('Task Not Found');
                }
            }
            else {
                throw new Error('This task is not for this student');
            }
        }
        else {
            throw new Error('Student Not Found');
        }
    }
    async movePersonalTaskToReview(moveToStatusInput) {
        const { student_roll, task_name } = moveToStatusInput;
        const personalTask = await this.taskService.getPersonalTaskByName(task_name);
        const student = await this.studentRepository.findOne({
            where: { stud_roll: student_roll },
        });
        if (student) {
            const indexincompleted = student.personalTasks.completed.indexOf(task_name);
            const indexinexecuting = student.personalTasks.executing.indexOf(task_name);
            const indexintodo = student.personalTasks.todo.indexOf(task_name);
            const indexinfinished = student.personalTasks.finished.indexOf(task_name);
            if (student.tasks.includes(task_name)) {
                if (personalTask) {
                    if (indexincompleted !== -1) {
                        student.personalTasks.completed.splice(indexincompleted, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: [...student.personalTasks.todo],
                                executing: [...student.personalTasks.executing],
                                completed: student.personalTasks.completed,
                                review: [
                                    ...student.personalTasks.review,
                                    personalTask.task_name,
                                ],
                                finished: [...student.personalTasks.finished],
                            },
                        });
                        return true;
                    }
                    else if (indexinexecuting !== -1) {
                        student.personalTasks.executing.splice(indexinexecuting, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: [...student.personalTasks.todo],
                                executing: student.personalTasks.executing,
                                completed: [...student.personalTasks.completed],
                                review: [
                                    ...student.personalTasks.review,
                                    personalTask.task_name,
                                ],
                                finished: [...student.personalTasks.finished],
                            },
                        });
                        return true;
                    }
                    else if (indexintodo !== -1) {
                        student.personalTasks.todo.splice(indexintodo, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: student.personalTasks.todo,
                                executing: [...student.personalTasks.executing],
                                completed: [...student.personalTasks.completed],
                                review: [
                                    ...student.personalTasks.review,
                                    personalTask.task_name,
                                ],
                                finished: [...student.personalTasks.finished],
                            },
                        });
                        return true;
                    }
                    else if (indexinfinished !== -1) {
                        student.personalTasks.finished.splice(indexinfinished, 1);
                        await this.studentRepository.update(student._id, {
                            personalTasks: {
                                todo: [...student.personalTasks.todo],
                                executing: [...student.personalTasks.executing],
                                completed: [...student.personalTasks.completed],
                                review: [
                                    ...student.personalTasks.review,
                                    personalTask.task_name,
                                ],
                                finished: student.personalTasks.finished,
                            },
                        });
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    throw new Error('Task Not Found');
                }
            }
            else {
                throw new Error('This task is not for this student');
            }
        }
        else {
            throw new Error('Student Not Found');
        }
    }
    async moveTaskToReview(moveToStatusInput) {
        const { student_roll, task_name } = moveToStatusInput;
        const task = await this.taskService.searchTaskByName(task_name);
        const student = await this.studentRepository.findOne({
            where: { stud_roll: student_roll },
        });
        if (student) {
            const indexincompleted = student.taskwithstatus.completed.indexOf(task_name);
            const indexinexecuting = student.taskwithstatus.executing.indexOf(task_name);
            const indexintodo = student.taskwithstatus.todo.indexOf(task_name);
            const indexinfinished = student.taskwithstatus.finished.indexOf(task_name);
            if (student.tasks.includes(task_name)) {
                if (task) {
                    if (indexincompleted !== -1) {
                        student.taskwithstatus.completed.splice(indexincompleted, 1);
                        await this.studentRepository.update(student._id, {
                            taskwithstatus: {
                                todo: [...student.taskwithstatus.todo],
                                executing: [...student.taskwithstatus.executing],
                                completed: student.taskwithstatus.completed,
                                review: [...student.taskwithstatus.review, task.task_name],
                                finished: [...student.taskwithstatus.finished],
                            },
                        });
                        return true;
                    }
                    else if (indexinexecuting !== -1) {
                        student.taskwithstatus.executing.splice(indexinexecuting, 1);
                        await this.studentRepository.update(student._id, {
                            taskwithstatus: {
                                todo: [...student.taskwithstatus.todo],
                                executing: student.taskwithstatus.executing,
                                completed: [...student.taskwithstatus.completed],
                                review: [...student.taskwithstatus.review, task.task_name],
                                finished: [...student.taskwithstatus.finished],
                            },
                        });
                        return true;
                    }
                    else if (indexintodo !== -1) {
                        student.taskwithstatus.todo.splice(indexintodo, 1);
                        await this.studentRepository.update(student._id, {
                            taskwithstatus: {
                                todo: student.taskwithstatus.todo,
                                executing: [...student.taskwithstatus.executing],
                                completed: [...student.taskwithstatus.completed],
                                review: [...student.taskwithstatus.review, task.task_name],
                                finished: [...student.taskwithstatus.finished],
                            },
                        });
                        return true;
                    }
                    else if (indexinfinished !== -1) {
                        student.taskwithstatus.finished.splice(indexinfinished, 1);
                        await this.studentRepository.update(student._id, {
                            taskwithstatus: {
                                todo: [...student.taskwithstatus.todo],
                                executing: [...student.taskwithstatus.executing],
                                completed: [...student.taskwithstatus.completed],
                                review: [...student.taskwithstatus.review, task.task_name],
                                finished: student.taskwithstatus.finished,
                            },
                        });
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    throw new Error('Task Not Found');
                }
            }
            else {
                throw new Error('This task is not for this student');
            }
        }
        else {
            throw new Error('Student Not Found');
        }
    }
    async searchStudentByName(stud_name) {
        return await this.studentRepository.findOne({ where: { stud_name } });
    }
    async checkStudentByTaskName(stud_name, tasks_name) {
        const student = await this.searchStudentByName(stud_name);
        const res = student.tasks.includes(tasks_name);
        return res;
    }
    async commentOnTask(commentInput) {
        const { stud_name, task_name, comment } = commentInput;
        const task = await this.taskService.searchTaskByName(task_name);
        const student = await this.searchStudentByName(stud_name);
        if (student) {
            const res = await this.checkStudentByTaskName(student.stud_name, task.task_name);
            if (res) {
                student.comment = [...student.comment, comment];
                await this.studentRepository.save(student);
                const mailTransporter = (0, nodemailer_1.createTransport)({
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    secure: false,
                    auth: {
                        user: `${process.env.USER}`,
                        pass: `${process.env.PASS}`,
                    },
                });
                mailTransporter.sendMail({
                    from: `${process.env.USER}`,
                    to: student.username,
                    subject: `Your Teacher Just Commented On Your Task ${task.task_name}`,
                    html: `<html>
                  <body>
                    <h1>Comment</h1>
                    <p>${comment}</p>
                  </body>
            </html>`,
                }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('Mail Sent To Student For The Comment');
                    }
                });
                return res;
            }
            throw new Error('No such Task Found');
        }
        throw new Error('Student Not Found');
    }
    async getStudentById(stud_id) {
        return this.studentRepository.findOneBy({ stud_id });
    }
    async uploadFile(filename, fileUploadDto) {
        const { stud_Id, taskName, type } = fileUploadDto;
        if (type === 'school') {
            const task = await this.taskService.searchT(taskName, stud_Id);
            if (task.length) {
                const student = await this.studentRepository.findOne({
                    where: { username: stud_Id },
                });
                if (student) {
                    const file = this.fileRepository.create({
                        fileName: filename,
                        stud_id: stud_Id,
                        file_id: (0, uuid_1.v4)(),
                        task_Name: taskName,
                        type: 'school',
                    });
                    return this.fileRepository.save(file);
                }
                throw new Error('Student was not found please check your Id');
            }
            else {
                throw new Error('Task Not Found');
            }
        }
        if (type === 'personal') {
            const personalTask = await this.taskService.searchPT(taskName, stud_Id);
            if (personalTask.length) {
                const student = await this.studentRepository.findOne({
                    where: { username: stud_Id },
                });
                const teacher = await this.teacherService.getTeacher(stud_Id);
                if (student) {
                    const file = this.fileRepository.create({
                        fileName: filename,
                        stud_id: stud_Id,
                        file_id: (0, uuid_1.v4)(),
                        task_Name: taskName,
                        type: 'personal',
                    });
                    return this.fileRepository.save(file);
                }
                else if (teacher) {
                    const file = this.fileRepository.create({
                        fileName: filename,
                        stud_id: stud_Id,
                        file_id: (0, uuid_1.v4)(),
                        task_Name: taskName,
                        type: 'personal',
                    });
                    return this.fileRepository.save(file);
                }
                throw new Error('User was not found please check your Id');
            }
            else {
                throw new Error('Personal Task Not Found');
            }
        }
        else {
            throw new Error(`Task Type Was Not Found!`);
        }
    }
    async deleteFileUpload(username, task_name, type) {
        const student = await this.getStudent(username);
        const teacher = await this.teacherService.getTeacher(username);
        if (teacher && teacher.assigned_tasks.includes(task_name)) {
            const upload = await this.fileRepository.findOne({
                where: { stud_id: teacher.username, task_Name: task_name, type },
            });
            if (upload) {
                const result = await this.fileRepository.delete(upload._id);
                return result.affected > 0;
            }
        }
        if (student && student.tasks.includes(task_name)) {
            const upload = await this.fileRepository.find({
                where: { stud_id: student.username, task_Name: task_name, type },
            });
            if (upload) {
                upload.map(async (file) => {
                    const result = await this.fileRepository.delete(file._id);
                    return result.affected > 0;
                });
            }
        }
    }
    async deleteUploadedFileByTask(task_name, type) {
        const task = await this.taskService.getTaskByName(task_name);
        if (task) {
            const result = await this.fileRepository.delete({
                task_Name: task.task_name,
                type,
            });
            return result.affected > 0;
        }
    }
    async getFile(fileInput) {
        const { stud_id, task_name } = fileInput;
        const file = await this.fileRepository.find({
            where: {
                task_Name: task_name,
                stud_id,
            },
        });
        if (file.length !== 0) {
            return file;
        }
    }
    async getAllStudentTodo(username) {
        const student = await this.getStudent(username);
        if (student) {
            const todos = student.taskwithstatus.todo.map(async (task) => {
                return await this.taskService.searchTaskByName(task);
            });
            return todos;
        }
        else {
            return null;
        }
    }
    async getAllStudentPersonalTodo(username) {
        const student = await this.getStudent(username);
        if (student) {
            const todos = student.personalTasks.todo.map(async (task) => {
                return await this.taskService.searchPersonalTaskByName(task);
            });
            return todos;
        }
        else {
            return null;
        }
    }
    async getAllStudentExecuting(username) {
        const student = await this.getStudent(username);
        if (student) {
            const executing = student.taskwithstatus.executing.map(async (task) => {
                return await this.taskService.searchTaskByName(task);
            });
            return executing;
        }
        else {
            return null;
        }
    }
    async getAllStudentPersonalExecuting(username) {
        const student = await this.getStudent(username);
        if (student) {
            const executing = student.personalTasks.executing.map(async (task) => {
                return await this.taskService.searchPersonalTaskByName(task);
            });
            return executing;
        }
        else {
            return null;
        }
    }
    async getAllStudentCompletedList(username) {
        const student = await this.getStudent(username);
        if (student) {
            const completed = student.taskwithstatus.completed.map(async (task) => {
                return await this.taskService.searchTaskByName(task);
            });
            return completed;
        }
        else {
            return null;
        }
    }
    async getAllReviewOfStudent(username) {
        const student = await this.getStudent(username);
        if (student) {
            const review = student.taskwithstatus.review.map(async (task) => {
                return await this.taskService.searchTaskByName(task);
            });
            return review;
        }
        else {
            return null;
        }
    }
    async getAllStudentPersonalCompletedList(username) {
        const student = await this.getStudent(username);
        if (student) {
            const completed = student.personalTasks.completed.map(async (task) => {
                return await this.taskService.searchPersonalTaskByName(task);
            });
            return completed;
        }
        else {
            return null;
        }
    }
    async getAllStudentReviewList(username) {
        const student = await this.getStudent(username);
        if (student) {
            const review = student.taskwithstatus.review.map((task) => {
                return task;
            });
            return review;
        }
    }
    async getAllStudentPersonalReviewList(username) {
        const student = await this.getStudent(username);
        if (student) {
            const review = student.personalTasks.review.map(async (task) => {
                return await this.taskService.searchPersonalTaskByName(task);
            });
            return review;
        }
        else {
            return null;
        }
    }
    async getAllStudentFinishedList(username) {
        const student = await this.getStudent(username);
        if (student) {
            const finished = student.taskwithstatus.finished.map((task) => {
                return task;
            });
            return finished;
        }
    }
    async getAllStudentPerosnalFinishedList(username) {
        const student = await this.getStudent(username);
        if (student) {
            const finished = student.personalTasks.finished.map(async (task) => {
                return await this.taskService.searchPersonalTaskByName(task);
            });
            return finished;
        }
        else {
            return null;
        }
    }
    async getCountOfPersonalTasks(username) {
        const student = await this.getStudent(username);
        if (student) {
            let num = 0;
            student.personalTasks.todo.map(() => {
                num++;
            });
            const todo = num;
            num = 0;
            student.personalTasks.executing.map(() => {
                num++;
            });
            const executing = num;
            num = 0;
            student.personalTasks.completed.map(() => {
                num++;
            });
            const completed = num;
            num = 0;
            student.personalTasks.review.map(() => {
                num++;
            });
            const review = num;
            num = 0;
            student.personalTasks.finished.map(() => {
                num++;
            });
            const finished = num;
            return [todo, executing, completed, review, finished];
        }
    }
    async getCountOfSchoolTasks(username) {
        const student = await this.getStudent(username);
        if (student) {
            let num = 0;
            student.taskwithstatus.todo.map(() => {
                num++;
            });
            const todo = num;
            num = 0;
            student.taskwithstatus.executing.map(() => {
                num++;
            });
            const executing = num;
            num = 0;
            student.taskwithstatus.completed.map(() => {
                num++;
            });
            const completed = num;
            num = 0;
            student.taskwithstatus.review.map(() => {
                num++;
            });
            const review = num;
            num = 0;
            student.taskwithstatus.finished.map(() => {
                num++;
            });
            const finished = num;
            return [todo, executing, completed, review, finished];
        }
    }
    async getCountOfAllTask(username) {
        const student = await this.getStudent(username);
        if (student) {
            let num = 0;
            student.taskwithstatus.todo.map(() => {
                num++;
            });
            const todo = num;
            num = 0;
            student.taskwithstatus.executing.map(() => {
                num++;
            });
            const executing = num;
            num = 0;
            student.taskwithstatus.completed.map(() => {
                num++;
            });
            const completed = num;
            num = 0;
            student.taskwithstatus.review.map(() => {
                num++;
            });
            const review = num;
            num = 0;
            student.taskwithstatus.finished.map(() => {
                num++;
            });
            const finished = num;
            let num1 = 0;
            student.personalTasks.todo.map(() => {
                num1++;
            });
            const todo1 = num1;
            num1 = 0;
            student.personalTasks.executing.map(() => {
                num1++;
            });
            const executing1 = num1;
            num1 = 0;
            student.personalTasks.completed.map(() => {
                num1++;
            });
            const completed1 = num1;
            num1 = 0;
            student.personalTasks.review.map(() => {
                num1++;
            });
            const review1 = num1;
            num1 = 0;
            student.personalTasks.finished.map(() => {
                num1++;
            });
            const finished1 = num1;
            return [
                [todo, todo1],
                [executing, executing1],
                [completed, completed1],
                [review, review1],
                [finished, finished1],
            ];
        }
    }
    async getRecentTasks(username) {
        const student = await this.getStudent(username);
        if (student) {
            const tasks = student.tasks.map((task) => {
                return task;
            });
            return tasks.reverse().slice(0, 5);
        }
    }
};
StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(students_entity_1.Students)),
    __param(1, (0, typeorm_1.InjectRepository)(file_entity_1.File)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => tasks_service_1.TasksService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => teachers_service_1.TeachersService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        tasks_service_1.TasksService,
        teachers_service_1.TeachersService])
], StudentsService);
exports.StudentsService = StudentsService;
//# sourceMappingURL=students.service.js.map