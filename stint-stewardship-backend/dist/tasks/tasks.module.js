"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TasksModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tasks_entity_1 = require("./tasks.entity");
const tasks_resolver_1 = require("./tasks.resolver");
const tasks_service_1 = require("./tasks.service");
const subject_module_1 = require("../subject/subject.module");
const students_module_1 = require("../students/students.module");
const teachers_module_1 = require("../teachers/teachers.module");
const perosonal_tasks_entity_1 = require("./perosonal.tasks.entity");
let TasksModule = TasksModule_1 = class TasksModule {
};
TasksModule = TasksModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([tasks_entity_1.Tasks]),
            typeorm_1.TypeOrmModule.forFeature([perosonal_tasks_entity_1.PersonalTasks]),
            subject_module_1.SubjectModule,
            teachers_module_1.TeachersModule,
            (0, common_1.forwardRef)(() => students_module_1.StudentsModule),
        ],
        providers: [tasks_resolver_1.TasksResolver, tasks_service_1.TasksService],
        exports: [tasks_service_1.TasksService, TasksModule_1],
    })
], TasksModule);
exports.TasksModule = TasksModule;
//# sourceMappingURL=tasks.module.js.map