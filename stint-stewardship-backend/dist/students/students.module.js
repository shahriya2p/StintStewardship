"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const students_entity_1 = require("./students.entity");
const students_resolver_1 = require("./students.resolver");
const students_service_1 = require("./students.service");
const tasks_module_1 = require("../tasks/tasks.module");
const teachers_module_1 = require("../teachers/teachers.module");
const students_controller_1 = require("./students.controller");
const platform_express_1 = require("@nestjs/platform-express");
const file_entity_1 = require("./file.entity");
let StudentsModule = class StudentsModule {
};
StudentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([students_entity_1.Students]),
            typeorm_1.TypeOrmModule.forFeature([file_entity_1.File]),
            (0, common_1.forwardRef)(() => tasks_module_1.TasksModule),
            (0, common_1.forwardRef)(() => teachers_module_1.TeachersModule),
            platform_express_1.MulterModule.register({ dest: './uploads' }),
        ],
        providers: [students_resolver_1.StudentsResolver, students_service_1.StudentsService],
        exports: [students_service_1.StudentsService],
        controllers: [students_controller_1.StudentsController],
    })
], StudentsModule);
exports.StudentsModule = StudentsModule;
//# sourceMappingURL=students.module.js.map