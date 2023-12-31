import { Teachers } from './teachers.entity';
import { Repository } from 'typeorm';
import { CreateTeachersInput } from './create-teacher.input';
import { SubjectService } from 'src/subject/subject.service';
import { BroadcastInput } from './broadcast-student.input';
import { StudentsService } from 'src/students/students.service';
import { PersonalTasks } from 'src/tasks/perosonal.tasks.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { SwitchStatusInput } from './switchStatus.input';
export declare class TeachersService {
    private teachersRepository;
    private subjectService;
    private studentService;
    private taskService;
    constructor(teachersRepository: Repository<Teachers>, subjectService: SubjectService, studentService: StudentsService, taskService: TasksService);
    createTeacher(createTeacherInput: CreateTeachersInput): Promise<Teachers>;
    getTeachers(): Promise<Teachers[]>;
    getTeacher(username: string): Promise<Teachers>;
    getTeacherByName(name: string): Promise<Teachers>;
    getTeacherBySub(subject: string): Promise<Teachers>;
    broadcastBasedOnSem(broadcast: BroadcastInput): Promise<string>;
    assignTeacherWithPersonalTask(task: PersonalTasks): Promise<void>;
    removeTaskFromTeacher(task_name: string, username: string): Promise<void>;
    moveTaskToExecution(moveToStatusInput: SwitchStatusInput): Promise<boolean>;
    moveTaskToCompleted(moveToStatusInput: SwitchStatusInput): Promise<boolean>;
    moveTaskToTodo(moveToStatusInput: SwitchStatusInput): Promise<boolean>;
    movePersonalTaskToFinished(moveToStatusInput: SwitchStatusInput): Promise<boolean>;
    movePersonalTaskToReview(moveToStatusInput: SwitchStatusInput): Promise<boolean>;
    getAllTeacherTodo(username: string): Promise<Promise<PersonalTasks>[]>;
    getAllTeacherExecuting(username: string): Promise<Promise<PersonalTasks>[]>;
    getAllTeacherCompletedList(username: string): Promise<Promise<PersonalTasks>[]>;
    getAllTeacherReviewList(username: string): Promise<Promise<PersonalTasks>[]>;
    getAllTeacherFinishedList(username: string): Promise<Promise<PersonalTasks>[]>;
    getRecentTeacher(username: string): Promise<string[]>;
    getCountOfTeacherPersonalTasks(username: string): Promise<number[]>;
}
