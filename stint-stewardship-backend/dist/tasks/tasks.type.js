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
exports.TasksType = void 0;
const graphql_1 = require("@nestjs/graphql");
let TasksType = class TasksType {
};
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], TasksType.prototype, "tasks_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TasksType.prototype, "task_name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], TasksType.prototype, "semester", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TasksType.prototype, "created_date", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], TasksType.prototype, "subject_code", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], TasksType.prototype, "alloted_students", void 0);
__decorate([
    (0, graphql_1.Field)(() => String),
    __metadata("design:type", String)
], TasksType.prototype, "teacher", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], TasksType.prototype, "deadline", void 0);
TasksType = __decorate([
    (0, graphql_1.ObjectType)('Tasks')
], TasksType);
exports.TasksType = TasksType;
//# sourceMappingURL=tasks.type.js.map