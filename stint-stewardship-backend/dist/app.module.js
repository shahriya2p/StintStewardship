"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("@nestjs/typeorm");
const tasks_module_1 = require("./tasks/tasks.module");
const students_module_1 = require("./students/students.module");
const apollo_server_core_1 = require("apollo-server-core");
const subject_module_1 = require("./subject/subject.module");
const students_entity_1 = require("./students/students.entity");
const apollo_1 = require("@nestjs/apollo");
const tasks_entity_1 = require("./tasks/tasks.entity");
const subject_entity_1 = require("./subject/subject.entity");
const teachers_entity_1 = require("./teachers/teachers.entity");
const teachers_module_1 = require("./teachers/teachers.module");
const auth_module_1 = require("./auth/auth.module");
const perosonal_tasks_entity_1 = require("./tasks/perosonal.tasks.entity");
const schedule_1 = require("@nestjs/schedule");
const file_entity_1 = require("./students/file.entity");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot({
                type: `mongodb`,
                url: `${process.env.DB_URL}`,
                synchronize: true,
                useNewUrlParser: true,
                useUnifiedTopology: true,
                autoLoadEntities: true,
                entities: [students_entity_1.Students, tasks_entity_1.Tasks, teachers_entity_1.Teachers, subject_entity_1.Subject, perosonal_tasks_entity_1.PersonalTasks, file_entity_1.File],
            }),
            graphql_1.GraphQLModule.forRoot({
                autoSchemaFile: true,
                playground: false,
                plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)()],
                driver: apollo_1.ApolloDriver,
                context: ({ req }) => ({ headers: req.headers }),
            }),
            schedule_1.ScheduleModule.forRoot(),
            tasks_module_1.TasksModule,
            students_module_1.StudentsModule,
            teachers_module_1.TeachersModule,
            subject_module_1.SubjectModule,
            auth_module_1.AuthModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map