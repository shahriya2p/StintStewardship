import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StudentsService } from 'src/students/students.service';
import { JwtPayload } from './jwt-user.payload';
import { TeachersService } from 'src/teachers/teachers.service';
import { UserLoginInput } from './User-Login.input';

@Injectable()
export class AuthService {
  constructor(
    private studentService: StudentsService,
    private teacherService: TeachersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const student = await this.studentService.getStudent(username);
    const teacher = await this.teacherService.getTeacher(username);

    if (student) {
      if (student && student.password === password) {
        const { password, ...result } = student;
        return result;
      }
    } else if (teacher) {
      if (teacher && teacher.password === password) {
        const { password, ...result } = teacher;
        return result;
      }
    } else {
      return null;
    }
  }

  async login(
    userLoginInput: UserLoginInput,
  ): Promise<{ accessToken: string }> {
    const { username, role, password } = userLoginInput;
    if (role === 'student') {
      const student = await this.studentService.getStudent(username);
      if (student && student.password === password) {
        const payload: JwtPayload = { username, role };
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
    } else if (role === 'teacher') {
      const teacher = await this.teacherService.getTeacher(username);
      if (teacher && teacher.password === password) {
        const payload: JwtPayload = { username, role };
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
    } else {
      throw new Error('Role Not Found');
    }
  }
}
