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
exports.SubjectResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const subject_service_1 = require("./subject.service");
const subject_type_1 = require("./subject.type");
const create_subject_input_1 = require("./create-subject.input");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt.auth.guard");
const role_guard_1 = require("../auth/role.guard");
const roles_decorator_1 = require("../auth/roles.decorator");
const role_enum_1 = require("../auth/role.enum");
let SubjectResolver = class SubjectResolver {
    constructor(subjectService) {
        this.subjectService = subjectService;
    }
    async createSubject(createSubjectInput) {
        return this.subjectService.createSubject(createSubjectInput);
    }
    async getSubjects() {
        return await this.subjectService.getSubjects();
    }
    async getSubjectById(subject_code) {
        return await this.subjectService.getSubjectById(subject_code);
    }
    async deleteSubject(id) {
        return this.subjectService.deleteSubject(id);
    }
};
__decorate([
    (0, graphql_1.Mutation)(() => subject_type_1.SubjectType),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('createSubjectInput')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subject_input_1.CreateSubjectInput]),
    __metadata("design:returntype", Promise)
], SubjectResolver.prototype, "createSubject", null);
__decorate([
    (0, graphql_1.Query)(() => [subject_type_1.SubjectType]),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubjectResolver.prototype, "getSubjects", null);
__decorate([
    (0, graphql_1.Query)(() => subject_type_1.SubjectType),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Student),
    __param(0, (0, graphql_1.Args)('subject_code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SubjectResolver.prototype, "getSubjectById", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.Teacher),
    __param(0, (0, graphql_1.Args)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubjectResolver.prototype, "deleteSubject", null);
SubjectResolver = __decorate([
    (0, graphql_1.Resolver)(() => subject_type_1.SubjectType),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, role_guard_1.RolesGuard),
    __metadata("design:paramtypes", [subject_service_1.SubjectService])
], SubjectResolver);
exports.SubjectResolver = SubjectResolver;
//# sourceMappingURL=subject.resolver.js.map