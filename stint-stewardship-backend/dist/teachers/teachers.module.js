"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeachersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const teachers_entity_1 = require("./teachers.entity");
const teachers_resolver_1 = require("./teachers.resolver");
const teachers_service_1 = require("./teachers.service");
const subject_module_1 = require("../subject/subject.module");
const students_module_1 = require("../students/students.module");
const tasks_module_1 = require("../tasks/tasks.module");
let TeachersModule = class TeachersModule {
};
TeachersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([teachers_entity_1.Teachers]),
            (0, common_1.forwardRef)(() => students_module_1.StudentsModule),
            (0, common_1.forwardRef)(() => subject_module_1.SubjectModule),
            (0, common_1.forwardRef)(() => tasks_module_1.TasksModule),
        ],
        providers: [teachers_resolver_1.TeachersResolver, teachers_service_1.TeachersService],
        exports: [teachers_service_1.TeachersService],
    })
], TeachersModule);
exports.TeachersModule = TeachersModule;
//# sourceMappingURL=teachers.module.js.map