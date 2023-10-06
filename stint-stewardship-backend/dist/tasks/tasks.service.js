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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tasks_entity_1 = require("./tasks.entity");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const subject_service_1 = require("../subject/subject.service");
const students_service_1 = require("../students/students.service");
const teachers_service_1 = require("../teachers/teachers.service");
const nodemailer_1 = require("nodemailer");
const perosonal_tasks_entity_1 = require("./perosonal.tasks.entity");
let TasksService = class TasksService {
    constructor(personalTasksRepository, tasksRepository, subjectService, studentService, teacherService) {
        this.personalTasksRepository = personalTasksRepository;
        this.tasksRepository = tasksRepository;
        this.subjectService = subjectService;
        this.studentService = studentService;
        this.teacherService = teacherService;
    }
    async createTask(createTasksType) {
        const { task_name, semester, subject_code, deadline } = createTasksType;
        if (task_name !== '' && semester) {
            const subject = await this.subjectService.getSubjectById(subject_code);
            const usernames = await this.studentService.getStudentUsernamesBySem(semester);
            if (subject) {
                const teacher = await this.teacherService.getTeacherBySub(subject.sub_name);
                if (teacher) {
                    const task = this.tasksRepository.create({
                        tasks_id: (0, uuid_1.v4)(),
                        task_name,
                        semester,
                        subject_code: subject.sub_code,
                        alloted_students: usernames || [],
                        teacher: teacher.teacher_name,
                        created_date: new Date().toLocaleString(),
                        deadline: deadline,
                    });
                    await this.studentService.assignStudentsWithTask(task);
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
                        to: Array.isArray(usernames) ? usernames.join(',') : usernames,
                        subject: `New Task Assigned for Subject ${subject.sub_name}`,
                        html: `<html>
                  <body>
                    <h1>New Tasks of ${subject.sub_code} created on ${task.created_date}</h1>
                    <p>Tasks is ${task.task_name}, Deadline:- ${task.deadline}</p>
                  </body>
            </html>`,
                    }, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log('Mails Sent To Students For New Task Created');
                        }
                    });
                    mailTransporter.sendMail({
                        from: `${process.env.USER}`,
                        to: `${teacher.username}`,
                        subject: `Created This Task Successfully`,
                        html: `<html>
                  <body>
                    <h1>Created New Task For Students of Sem ${task.semester}</h1>
                    <p>The Email was sent to all the Students, the students are ${task.alloted_students}</p>
                  </body>
            </html>`,
                    }, (err) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log('Email Sent To Teacher For Creating New Task');
                        }
                    });
                    return await this.tasksRepository.save(task);
                }
                else {
                    throw new Error('Please Assign Task of your subject');
                }
            }
            else {
                throw new Error('Subject of that subject code was not found');
            }
        }
        else {
            throw new Error('Task Name And Semester Cannot Be Empty');
        }
    }
    async getTasks() {
        const tasks = await this.tasksRepository.find();
        return tasks;
    }
    async getTasksBySem(semester) {
        const tasks = await this.tasksRepository.find({ where: { semester } });
        return tasks.map((task) => task.task_name);
    }
    async assignTasksToNewStudent(student) {
        const tasks = await this.tasksRepository.find({
            where: { semester: student.semester },
        });
        tasks.map((task) => (task.alloted_students = [...task.alloted_students, student.stud_id]));
        await this.tasksRepository.save(tasks);
    }
    async deleteTask(id) {
        const task_to_delete = await this.tasksRepository.findOne({
            where: { tasks_id: id },
        });
        if (task_to_delete) {
            await this.studentService.deleteUploadedFileByTask(task_to_delete.task_name, 'school');
            await this.studentService.removeTaskFromStudent(task_to_delete.task_name);
            const result = await this.tasksRepository.delete(task_to_delete._id);
            return result.affected > 0;
        }
        else {
            return false;
        }
    }
    async deletePersonalTaskForStud(name, username) {
        const per_task = await this.personalTasksRepository.findOne({
            where: { task_name: name, username },
        });
        if (per_task) {
            this.studentService.deleteFileUpload(per_task.username, per_task.task_name, 'personal');
            await this.studentService.removePersonalTaskFromStudents(per_task.task_name, per_task.username);
            const result = await this.personalTasksRepository.delete(per_task._id);
            return result.affected > 0;
        }
        else {
            throw new Error('Student Task Not Found');
        }
    }
    async deletePersonalTaskForTeacher(name, username) {
        const per_task = await this.personalTasksRepository.findOne({
            where: { task_name: name, username },
        });
        if (per_task) {
            await this.studentService.deleteFileUpload(per_task.username, per_task.task_name, 'personal');
            await this.teacherService.removeTaskFromTeacher(per_task.task_name, per_task.username);
            const result = await this.personalTasksRepository.delete(per_task._id);
            return result.affected > 0;
        }
        else {
            throw new Error('Teacher Task Not Found');
        }
    }
    async searchTaskByName(task_name) {
        const task = await this.tasksRepository.findOne({ where: { task_name } });
        if (task) {
            return task;
        }
    }
    async searchT(task_name, username) {
        const task = await this.tasksRepository.find({
            where: { task_name, alloted_students: username },
        });
        if (task) {
            return task;
        }
    }
    async searchPT(task_name, username) {
        const personalTask = await this.personalTasksRepository.find({
            where: { task_name, alloted_user: username },
        });
        if (personalTask) {
            return personalTask;
        }
    }
    async searchPersonalTaskByName(task_name) {
        const personalTask = await this.personalTasksRepository.findOne({
            where: { task_name },
        });
        if (personalTask) {
            return personalTask;
        }
    }
    async createTaskForPersonal(createCustomTasksInput) {
        const { task_name, content, username, deadline } = createCustomTasksInput;
        if (task_name !== '') {
            const teacher = await this.teacherService.getTeacher(username);
            const student = await this.studentService.getStudent(username);
            if (teacher) {
                const user = this.personalTasksRepository.create({
                    tasks_id: (0, uuid_1.v4)(),
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
            }
            else if (student) {
                const user = this.personalTasksRepository.create({
                    tasks_id: (0, uuid_1.v4)(),
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
            }
            else {
                throw new Error('User Not Found, Please Register As One');
            }
        }
        else {
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
        const approachingPersonalDeadlines = await this.personalTasksRepository.find({
            where: {
                deadline: now,
            },
        });
        if (approachingDeadlines.length === 0 ||
            approachingPersonalDeadlines.length === 0) {
            console.log('no deadlines yet');
        }
        if (approachingDeadlines) {
            approachingDeadlines.forEach((task) => {
                const usernames = task.alloted_students;
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
                    to: Array.isArray(usernames) ? usernames.join(',') : usernames,
                    subject: `Deadline Approaching for Task ${task.task_name}`,
                    html: `<html>
                  <body>
                    <h1>Make Sure To Complete the Tasks</h1>
                    <p>The Deadline is ${task.deadline}</p>
                  </body>
            </html>`,
                }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(`Mails Sent To ${task.alloted_students} For Deadline`);
                        return true;
                    }
                });
            });
        }
        if (approachingPersonalDeadlines) {
            approachingPersonalDeadlines.forEach((task) => {
                const usernames = task.alloted_user;
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
                    to: Array.isArray(usernames) ? usernames.join(',') : usernames,
                    subject: `Deadline Approaching for Task ${task.task_name}`,
                    html: `<html>
                  <body>
                    <h1>Reminder To Complete the Tasks</h1>
                    <p>The Deadline is ${task.deadline}</p>
                  </body>
            </html>`,
                }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(`Mails Sent To ${task.alloted_user} For Deadline`);
                        return true;
                    }
                });
            });
        }
    }
    async getPersonalTaskByName(task_name) {
        const task = await this.personalTasksRepository.findOne({
            where: { task_name },
        });
        if (task) {
            return task;
        }
    }
    async getPersonalTaskByNameUsername(task_name, username) {
        const task = await this.personalTasksRepository.findOne({
            where: { task_name, username },
        });
        if (task) {
            return task;
        }
    }
    async getTaskByName(name) {
        const task = await this.tasksRepository.findOne({
            where: { task_name: name },
        });
        if (task) {
            return task;
        }
    }
    async getTasksByTeacher(username) {
        if (username) {
            const teacher = await this.teacherService.getTeacher(username);
            if (teacher) {
                const tasks = this.tasksRepository.find({
                    where: { teacher: teacher.teacher_name },
                });
                return tasks;
            }
            else {
                throw new Error('Teacher Not Found');
            }
        }
    }
};
TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(perosonal_tasks_entity_1.PersonalTasks)),
    __param(1, (0, typeorm_1.InjectRepository)(tasks_entity_1.Tasks)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => students_service_1.StudentsService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        subject_service_1.SubjectService,
        students_service_1.StudentsService,
        teachers_service_1.TeachersService])
], TasksService);
exports.TasksService = TasksService;
//# sourceMappingURL=tasks.service.js.map