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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const students_service_1 = require("../students/students.service");
const teachers_service_1 = require("../teachers/teachers.service");
let AuthService = class AuthService {
    constructor(studentService, teacherService, jwtService) {
        this.studentService = studentService;
        this.teacherService = teacherService;
        this.jwtService = jwtService;
    }
    async validateUser(username, password) {
        const student = await this.studentService.getStudent(username);
        const teacher = await this.teacherService.getTeacher(username);
        if (student) {
            if (student && student.password === password) {
                const { password } = student, result = __rest(student, ["password"]);
                return result;
            }
        }
        else if (teacher) {
            if (teacher && teacher.password === password) {
                const { password } = teacher, result = __rest(teacher, ["password"]);
                return result;
            }
        }
        else {
            return null;
        }
    }
    async login(userLoginInput) {
        const { username, role, password } = userLoginInput;
        if (role === 'student') {
            const student = await this.studentService.getStudent(username);
            if (student && student.password === password) {
                const payload = { username, role };
                const secret = { secret: process.env.JWT_SECRET };
                return {
                    accessToken: await this.jwtService.sign(payload, secret),
                };
            }
            if (student && student.password !== password) {
                throw new Error('Wrong Credentials');
            }
            if (!student) {
                throw new Error('Student Not Found');
            }
        }
        else if (role === 'teacher') {
            const teacher = await this.teacherService.getTeacher(username);
            if (teacher && teacher.password === password) {
                const payload = { username, role };
                const secret = { secret: process.env.JWT_SECRET };
                return {
                    accessToken: await this.jwtService.sign(payload, secret),
                };
            }
            if (teacher && teacher.password !== password) {
                throw new Error('Wrong Credentials');
            }
            if (!teacher) {
                throw new Error('Teacher Not Found');
            }
        }
        else {
            throw new Error('Role Not Found');
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [students_service_1.StudentsService,
        teachers_service_1.TeachersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map