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
exports.TeachersType = exports.TasksWithStatusTypeForTeacher = void 0;
const graphql_1 = require("@nestjs/graphql");
let TasksWithStatusTypeForTeacher = class TasksWithStatusTypeForTeacher {
};
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], TasksWithStatusTypeForTeacher.prototype, "todo", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], TasksWithStatusTypeForTeacher.prototype, "executing", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], TasksWithStatusTypeForTeacher.prototype, "completed", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], TasksWithStatusTypeForTeacher.prototype, "review", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], TasksWithStatusTypeForTeacher.prototype, "finished", void 0);
TasksWithStatusTypeForTeacher = __decorate([
    (0, graphql_1.ObjectType)()
], TasksWithStatusTypeForTeacher);
exports.TasksWithStatusTypeForTeacher = TasksWithStatusTypeForTeacher;
let TeachersType = class TeachersType {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], TeachersType.prototype, "teacher_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TeachersType.prototype, "teacher_name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TeachersType.prototype, "teacher_subject", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], TeachersType.prototype, "subject_code", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], TeachersType.prototype, "assigned_tasks", void 0);
__decorate([
    (0, graphql_1.Field)(() => TasksWithStatusTypeForTeacher, { nullable: true }),
    __metadata("design:type", TasksWithStatusTypeForTeacher)
], TeachersType.prototype, "personalTasks", void 0);
TeachersType = __decorate([
    (0, graphql_1.ObjectType)('Teachers')
], TeachersType);
exports.TeachersType = TeachersType;
//# sourceMappingURL=teachers.type.js.map