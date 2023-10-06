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
exports.TeachersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const teachers_service_1 = require("./teachers.service");
const teachers_type_1 = require("./teachers.type");
const create_teacher_input_1 = require("./create-teacher.input");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt.auth.guard");
const role_guard_1 = require("../auth/role.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const role_enum_1 = require("../auth/role.enum");
const broadcast_student_input_1 = require("./broadcast-student.input");
const switchStatus_input_1 = require("./switchStatus.input");
const task_input_custom_1 = require("../tasks/task.input.custom");
let TeachersResolver = class TeachersResolver {
    constructor(teachersService) {
        this.teachersService = teachersService;
    }
    async createTeacher(createTeacherInput) {
        return this.teachersService.createTeacher(createTeacherInput);
    }
    async getTeachers() {
        return this.teachersService.getTeachers();
    }
    async broadcastBasedOnSem(broadcast) {
        return this.teachersService.broadcastBasedOnSem(broadcast);
    }
    async moveTaskToExecutingForTeacher(moveToStatusInput) {
        return this.teachersService.moveTaskToExecution(moveToStatusInput);
    }
    async moveTaskToCompletedForTeacher(moveToStatusInput) {
        return this.teachersService.moveTaskToCompleted(moveToStatusInput);
    }
    async moveTaskToFinishedForTeacher(moveToStatusInput) {
        return this.teachersService.movePersonalTaskToFinished(moveToStatusInput);
    }
    async moveTaskToReviewForTeacher(moveToStatusInput) {
        return this.teachersService.movePersonalTaskToReview(moveToStatusInput);
    }
    async moveTaskToTodoForTeacher(moveToStatusInput) {
        return this.teachersService.moveTaskToTodo(moveToStatusInput);
    }
    async getTeacher(username) {
        return this.teachersService.getTeacher(username);
    }
    async getAllFinishedOfTeacher(username) {
        return this.teachersService.getAllTeacherFinishedList(username);
    }
    async getAllReviewOfTeacher(username) {
        return this.teachersService.getAllTeacherReviewList(username);
    }
    async getAllCompletedOfTeacher(username) {
        return this.teachersService.getAllTeacherCompletedList(username);
    }
    async getAllExecutingOfTeacher(username) {
        return this.teachersService.getAllTeacherExecuting(username);
    }
    async getAllTodoOfTeacher(username) {
        return this.teachersService.getAllTeacherTodo(username);
    }
    async getRecentTeacher(username) {
        return this.teachersService.getRecentTeacher(username);
    }
    async getCountOfTeacherPersonalTasks(username) {
        return this.teachersService.getCountOfTeacherPersonalTasks(username);
    }
};
__decorate([
    (0, graphql_1.Mutation)(() => teachers_type_1.TeachersType),
    __param(0, (0, graphql_1.Args)('createTeacherInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_teacher_input_1.CreateTeachersInput]),
    __metadata("design:returntype", Promise)
], TeachersResolver.prototype, "createTeacher", null);
__decorate([
    (0, graphql_1.Query)(() => [teachers_type_1.TeachersType]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TeachersResolver.prototype, "getTeachers", null);
__decorate([
    (0, graphql_1.Mutation)(() => String),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('EnterMessageAndSem')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [broadcast_student_input_1.BroadcastInput]),
    __metadata("design:returntype", Promise)
], TeachersResolver.prototype, "broadcastBasedOnSem", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('moveToExecution')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [switchStatus_input_1.SwitchStatusInput]),
    __metadata("design:returntype", Promise)
], TeachersResolver.prototype, "moveTaskToExecutingForTeacher", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('moveToCompleted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [switchStatus_input_1.SwitchStatusInput]),
    __metadata("design:returntype", Promise)
], TeachersResolver.prototype, "moveTaskToCompletedForTeacher", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('moveToFinished')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [switchStatus_input_1.SwitchStatusInput]),
    __metadata("design:returntype", Promise)
], TeachersResolver.prototype, "moveTaskToFinishedForTeacher", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('moveToReview')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [switchStatus_input_1.SwitchStatusInput]),
    __metadata("design:returntype", Promise)
], TeachersResolver.prototype, "moveTaskToReviewForTeacher", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('moveToTodo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [switchStatus_input_1.SwitchStatusInput]),
    __metadata("design:returntype", Promise)
], TeachersResolver.prototype, "moveTaskToTodoForTeacher", null);
__decorate([
    (0, graphql_1.Query)(() => teachers_type_1.TeachersType),
    __param(0, (0, graphql_1.Args)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeachersResolver.prototype, "getTeacher", null);
__decorate([
    (0, graphql_1.Query)(() => [task_input_custom_1.PersonalTasksType]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeachersResolver.prototype, "getAllFinishedOfTeacher", null);
__decorate([
    (0, graphql_1.Query)(() => [task_input_custom_1.PersonalTasksType]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeachersResolver.prototype, "getAllReviewOfTeacher", null);
__decorate([
    (0, graphql_1.Query)(() => [task_input_custom_1.PersonalTasksType]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeachersResolver.prototype, "getAllCompletedOfTeacher", null);
__decorate([
    (0, graphql_1.Query)(() => [task_input_custom_1.PersonalTasksType]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeachersResolver.prototype, "getAllExecutingOfTeacher", null);
__decorate([
    (0, graphql_1.Query)(() => [task_input_custom_1.PersonalTasksType]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('userName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeachersResolver.prototype, "getAllTodoOfTeacher", null);
__decorate([
    (0, graphql_1.Query)(() => [String]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeachersResolver.prototype, "getRecentTeacher", null);
__decorate([
    (0, graphql_1.Query)(() => [Number]),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeachersResolver.prototype, "getCountOfTeacherPersonalTasks", null);
TeachersResolver = __decorate([
    (0, graphql_1.Resolver)(() => teachers_type_1.TeachersType),
    __metadata("design:paramtypes", [teachers_service_1.TeachersService])
], TeachersResolver);
exports.TeachersResolver = TeachersResolver;
//# sourceMappingURL=teachers.resolver.js.map