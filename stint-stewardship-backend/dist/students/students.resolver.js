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
exports.StudentsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const students_type_1 = require("./students.type");
const students_service_1 = require("./students.service");
const create_student_input_type_1 = require("./create-student.input.type");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt.auth.guard");
const comment_task_input_1 = require("./comment-task-input");
const role_guard_1 = require("../auth/role.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const role_enum_1 = require("../auth/role.enum");
const file_type_1 = require("./file.type");
const file_input_1 = require("./file.input");
const moveToStatus_input_1 = require("./moveToStatus.input");
const tasks_type_1 = require("../tasks/tasks.type");
const task_input_custom_1 = require("../tasks/task.input.custom");
let StudentsResolver = class StudentsResolver {
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    async createStudent(createStudentInput) {
        return await this.studentsService.createStudent(createStudentInput);
    }
    getStudents() {
        return this.studentsService.getStudents();
    }
    async commentOnStudentTask(commentStudentTask) {
        return this.studentsService.commentOnTask(commentStudentTask);
    }
    async moveTaskToExecuting(moveToStatusInput) {
        return this.studentsService.moveTaskToExecution(moveToStatusInput);
    }
    async movePersonalTaskToExecuting(moveToStatusInput) {
        return this.studentsService.movePersonalTaskToExecution(moveToStatusInput);
    }
    async moveTaskToCompleted(moveToStatusInput) {
        return this.studentsService.moveTaskToCompleted(moveToStatusInput);
    }
    async movePersonalTaskToCompleted(moveToStatusInput) {
        return this.studentsService.movePersonalTaskToCompleted(moveToStatusInput);
    }
    async moveTaskToFinished(moveToStatusInput) {
        return this.studentsService.moveTaskToFinished(moveToStatusInput);
    }
    async movePersonalTaskToFinished(moveToStatusInput) {
        return this.studentsService.movePersonalTaskToFinished(moveToStatusInput);
    }
    async moveTaskToReview(moveToStatusInput) {
        return this.studentsService.moveTaskToReview(moveToStatusInput);
    }
    async movePersonalTaskToReview(moveToStatusInput) {
        return this.studentsService.movePersonalTaskToReview(moveToStatusInput);
    }
    async moveTaskToTodo(moveToStatusInput) {
        return this.studentsService.moveTaskToTodo(moveToStatusInput);
    }
    async movePersonalTaskToTodo(moveToStatusInput) {
        return this.studentsService.movePersonalTaskToTodo(moveToStatusInput);
    }
    async getFile(fileInput) {
        return this.studentsService.getFile(fileInput);
    }
    async getStudentByUsername(username) {
        return this.studentsService.getStudent(username);
    }
    async getAllTodoOfStudent(username) {
        return this.studentsService.getAllStudentTodo(username);
    }
    async getAllPersonalTodoOfStudent(username) {
        return this.studentsService.getAllStudentPersonalTodo(username);
    }
    async getAllCompletedOfStudent(username) {
        return this.studentsService.getAllStudentCompletedList(username);
    }
    async getAllPersonalCompletedOfStudent(username) {
        return this.studentsService.getAllStudentPersonalCompletedList(username);
    }
    async getAllExecutingOfStudent(username) {
        return this.studentsService.getAllStudentExecuting(username);
    }
    async getAllPersonalExecutingOfStudent(username) {
        return this.studentsService.getAllStudentPersonalExecuting(username);
    }
    async getAllReviewOfStudent(username) {
        return this.studentsService.getAllStudentReviewList(username);
    }
    async getAllReviewOfStudentByTeacher(username) {
        return this.studentsService.getAllReviewOfStudent(username);
    }
    async getAllPersonalReviewOfStudent(username) {
        return this.studentsService.getAllStudentPersonalReviewList(username);
    }
    async getAllFinishedOfStudent(username) {
        return this.studentsService.getAllStudentFinishedList(username);
    }
    async getAllPersonalFinishedOfStudent(username) {
        return this.studentsService.getAllStudentPerosnalFinishedList(username);
    }
    async getCountOfPersonalTasks(username) {
        return this.studentsService.getCountOfPersonalTasks(username);
    }
    async getCountOfSchoolTasks(username) {
        return this.studentsService.getCountOfSchoolTasks(username);
    }
    async getAllCount(username) {
        return this.studentsService.getCountOfAllTask(username);
    }
    async getRecent(username) {
        return this.studentsService.getRecentTasks(username);
    }
    async getStudentBySem(sem) {
        return this.studentsService.getStudentsBySemester(sem);
    }
};
__decorate([
    (0, graphql_1.Mutation)(() => students_type_1.StudentsType),
    __param(0, (0, graphql_1.Args)('createStudentInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_input_type_1.CreateStudentInput]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "createStudent", null);
__decorate([
    (0, graphql_1.Query)(() => [students_type_1.StudentsType]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StudentsResolver.prototype, "getStudents", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('commentOnStudentTask')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [comment_task_input_1.CommentTaskInput]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "commentOnStudentTask", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('moveToExecution')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [moveToStatus_input_1.MoveToStatusInput]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "moveTaskToExecuting", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('movePersonalToExecution')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [moveToStatus_input_1.MoveToStatusInput]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "movePersonalTaskToExecuting", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    __param(0, (0, graphql_1.Args)('moveToCompleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [moveToStatus_input_1.MoveToStatusInput]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "moveTaskToCompleted", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('movePersonalToCompleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [moveToStatus_input_1.MoveToStatusInput]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "movePersonalTaskToCompleted", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('moveToFinished')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [moveToStatus_input_1.MoveToStatusInput]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "moveTaskToFinished", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    __param(0, (0, graphql_1.Args)('moveToFinished')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [moveToStatus_input_1.MoveToStatusInput]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "movePersonalTaskToFinished", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('moveToReview')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [moveToStatus_input_1.MoveToStatusInput]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "moveTaskToReview", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    __param(0, (0, graphql_1.Args)('moveToReview')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [moveToStatus_input_1.MoveToStatusInput]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "movePersonalTaskToReview", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('moveToTodo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [moveToStatus_input_1.MoveToStatusInput]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "moveTaskToTodo", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('movePersonalToTodo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [moveToStatus_input_1.MoveToStatusInput]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "movePersonalTaskToTodo", null);
__decorate([
    (0, graphql_1.Query)(() => [file_type_1.FileType]),
    __param(0, (0, graphql_1.Args)('Cred')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [file_input_1.FileInput]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getFile", null);
__decorate([
    (0, graphql_1.Query)(() => students_type_1.StudentsType),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('getStudentByName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getStudentByUsername", null);
__decorate([
    (0, graphql_1.Query)(() => [tasks_type_1.TasksType]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getAllTodoOfStudent", null);
__decorate([
    (0, graphql_1.Query)(() => [task_input_custom_1.PersonalTasksType]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getAllPersonalTodoOfStudent", null);
__decorate([
    (0, graphql_1.Query)(() => [tasks_type_1.TasksType]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    __param(0, (0, graphql_1.Args)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getAllCompletedOfStudent", null);
__decorate([
    (0, graphql_1.Query)(() => [task_input_custom_1.PersonalTasksType]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getAllPersonalCompletedOfStudent", null);
__decorate([
    (0, graphql_1.Query)(() => [tasks_type_1.TasksType]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getAllExecutingOfStudent", null);
__decorate([
    (0, graphql_1.Query)(() => [task_input_custom_1.PersonalTasksType]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getAllPersonalExecutingOfStudent", null);
__decorate([
    (0, graphql_1.Query)(() => [String]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    __param(0, (0, graphql_1.Args)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getAllReviewOfStudent", null);
__decorate([
    (0, graphql_1.Query)(() => [tasks_type_1.TasksType]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getAllReviewOfStudentByTeacher", null);
__decorate([
    (0, graphql_1.Query)(() => [task_input_custom_1.PersonalTasksType]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getAllPersonalReviewOfStudent", null);
__decorate([
    (0, graphql_1.Query)(() => [String]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    __param(0, (0, graphql_1.Args)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getAllFinishedOfStudent", null);
__decorate([
    (0, graphql_1.Query)(() => [task_input_custom_1.PersonalTasksType]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getAllPersonalFinishedOfStudent", null);
__decorate([
    (0, graphql_1.Query)(() => [Number]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getCountOfPersonalTasks", null);
__decorate([
    (0, graphql_1.Query)(() => [Number]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getCountOfSchoolTasks", null);
__decorate([
    (0, graphql_1.Query)(() => [[Number]]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getAllCount", null);
__decorate([
    (0, graphql_1.Query)(() => [String]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getRecent", null);
__decorate([
    (0, graphql_1.Query)(() => [students_type_1.StudentsType]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('sem')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StudentsResolver.prototype, "getStudentBySem", null);
StudentsResolver = __decorate([
    (0, graphql_1.Resolver)(() => students_type_1.StudentsType),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsResolver);
exports.StudentsResolver = StudentsResolver;
//# sourceMappingURL=students.resolver.js.map