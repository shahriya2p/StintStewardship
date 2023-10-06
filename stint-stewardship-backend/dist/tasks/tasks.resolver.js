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
exports.TasksResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const tasks_type_1 = require("./tasks.type");
const tasks_service_1 = require("./tasks.service");
const create_tasks_input_1 = require("./create-tasks.input");
const jwt_auth_guard_1 = require("../auth/jwt.auth.guard");
const role_guard_1 = require("../auth/role.guard");
const common_1 = require("@nestjs/common");
const roles_decorator_1 = require("../auth/roles.decorator");
const role_enum_1 = require("../auth/role.enum");
const task_custom_input_type_1 = require("./task-custom.input.type");
const task_input_custom_1 = require("./task.input.custom");
const schedule_1 = require("@nestjs/schedule");
let TasksResolver = class TasksResolver {
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async createTask(createTasksType) {
        return await this.tasksService.createTask(createTasksType);
    }
    async getTasks() {
        return await this.tasksService.getTasks();
    }
    async deleteTask(id) {
        return this.tasksService.deleteTask(id);
    }
    async deletePersonalTaskForStudent(name, username) {
        return this.tasksService.deletePersonalTaskForStud(name, username);
    }
    async deletePersonalTaskForTeacher(name, username) {
        return this.tasksService.deletePersonalTaskForTeacher(name, username);
    }
    async createTaskForPersonal(createCustomTasksInput) {
        return this.tasksService.createTaskForPersonal(createCustomTasksInput);
    }
    async getTasksByTeacher(username) {
        return this.tasksService.getTasksByTeacher(username);
    }
    async searchTasks(task_name, username) {
        return this.tasksService.searchT(task_name, username);
    }
    async searchPersonalTasks(task_name, username) {
        return this.tasksService.searchPT(task_name, username);
    }
    async checkDeadlines() {
        return this.tasksService.checkDeadlines();
    }
    handle() {
        this.checkDeadlines();
    }
};
__decorate([
    (0, graphql_1.Mutation)(() => tasks_type_1.TasksType),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('createTasksType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tasks_input_1.CreateTasksType]),
    __metadata("design:returntype", Promise)
], TasksResolver.prototype, "createTask", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    (0, graphql_1.Query)(() => [tasks_type_1.TasksType]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksResolver.prototype, "getTasks", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksResolver.prototype, "deleteTask", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('name')),
    __param(1, (0, graphql_1.Args)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TasksResolver.prototype, "deletePersonalTaskForStudent", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, graphql_1.Args)('name')),
    __param(1, (0, graphql_1.Args)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TasksResolver.prototype, "deletePersonalTaskForTeacher", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, graphql_1.Mutation)(() => task_input_custom_1.PersonalTasksType),
    __param(0, (0, graphql_1.Args)('createForPersonalUse')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_custom_input_type_1.CreateCustomTasksType]),
    __metadata("design:returntype", Promise)
], TasksResolver.prototype, "createTaskForPersonal", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    (0, graphql_1.Query)(() => [tasks_type_1.TasksType]),
    __param(0, (0, graphql_1.Args)('getTasks')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksResolver.prototype, "getTasksByTeacher", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, graphql_1.Query)(() => [tasks_type_1.TasksType]),
    __param(0, (0, graphql_1.Args)('taskName')),
    __param(1, (0, graphql_1.Args)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TasksResolver.prototype, "searchTasks", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    (0, graphql_1.Query)(() => [task_input_custom_1.PersonalTasksType]),
    __param(0, (0, graphql_1.Args)('taskName')),
    __param(1, (0, graphql_1.Args)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TasksResolver.prototype, "searchPersonalTasks", null);
__decorate([
    (0, graphql_1.Query)(() => [Boolean]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksResolver.prototype, "checkDeadlines", null);
__decorate([
    (0, schedule_1.Interval)(86400000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TasksResolver.prototype, "handle", null);
TasksResolver = __decorate([
    (0, graphql_1.Resolver)(() => tasks_type_1.TasksType),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksResolver);
exports.TasksResolver = TasksResolver;
//# sourceMappingURL=tasks.resolver.js.map