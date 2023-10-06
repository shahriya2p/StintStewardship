import { JwtService } from '@nestjs/jwt';
import { StudentsService } from 'src/students/students.service';
import { TeachersService } from 'src/teachers/teachers.service';
import { UserLoginInput } from './User-Login.input';
export declare class AuthService {
    private studentService;
    private teacherService;
    private jwtService;
    constructor(studentService: StudentsService, teacherService: TeachersService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    login(userLoginInput: UserLoginInput): Promise<{
        accessToken: string;
    }>;
}
