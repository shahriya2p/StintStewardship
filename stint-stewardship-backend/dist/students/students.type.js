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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsType = exports.TasksWithStatusType = void 0;
const graphql_1 = require("@nestjs/graphql");
let TasksWithStatusType = class TasksWithStatusType {
};
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], TasksWithStatusType.prototype, "todo", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], TasksWithStatusType.prototype, "executing", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], TasksWithStatusType.prototype, "completed", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], TasksWithStatusType.prototype, "review", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], TasksWithStatusType.prototype, "finished", void 0);
TasksWithStatusType = __decorate([
    (0, graphql_1.ObjectType)()
], TasksWithStatusType);
exports.TasksWithStatusType = TasksWithStatusType;
let StudentsType = class StudentsType {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], StudentsType.prototype, "stud_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], StudentsType.prototype, "stud_name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], StudentsType.prototype, "stud_roll", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], StudentsType.prototype, "semester", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], StudentsType.prototype, "username", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], StudentsType.prototype, "password", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], StudentsType.prototype, "tasks", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], StudentsType.prototype, "comment", void 0);
__decorate([
    (0, graphql_1.Field)(() => TasksWithStatusType, { nullable: true }),
    __metadata("design:type", TasksWithStatusType)
], StudentsType.prototype, "taskswithstatus", void 0);
__decorate([
    (0, graphql_1.Field)(() => TasksWithStatusType, { nullable: true }),
    __metadata("design:type", TasksWithStatusType)
], StudentsType.prototype, "personalTasks", void 0);
StudentsType = __decorate([
    (0, graphql_1.ObjectType)('Students')
], StudentsType);
exports.StudentsType = StudentsType;
//# sourceMappingURL=students.type.js.map