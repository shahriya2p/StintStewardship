import { TeachersService } from './teachers.service';
import { Teachers } from './teachers.entity';
import { CreateTeachersInput } from './create-teacher.input';
import { BroadcastInput } from './broadcast-student.input';
import { SwitchStatusInput } from './switchStatus.input';
export declare class TeachersResolver {
    private teachersService;
    constructor(teachersService: TeachersService);
    createTeacher(createTeacherInput: CreateTeachersInput): Promise<Teachers>;
    getTeachers(): Promise<Teachers[]>;
    broadcastBasedOnSem(broadcast: BroadcastInput): Promise<string>;
    moveTaskToExecutingForTeacher(moveToStatusInput: SwitchStatusInput): Promise<boolean>;
    moveTaskToCompletedForTeacher(moveToStatusInput: SwitchStatusInput): Promise<boolean>;
    moveTaskToFinishedForTeacher(moveToStatusInput: SwitchStatusInput): Promise<boolean>;
    moveTaskToReviewForTeacher(moveToStatusInput: SwitchStatusInput): Promise<boolean>;
    moveTaskToTodoForTeacher(moveToStatusInput: SwitchStatusInput): Promise<boolean>;
    getTeacher(username: string): Promise<Teachers>;
    getAllFinishedOfTeacher(username: string): Promise<Promise<import("../tasks/perosonal.tasks.entity").PersonalTasks>[]>;
    getAllReviewOfTeacher(username: string): Promise<Promise<import("../tasks/perosonal.tasks.entity").PersonalTasks>[]>;
    getAllCompletedOfTeacher(username: string): Promise<Promise<import("../tasks/perosonal.tasks.entity").PersonalTasks>[]>;
    getAllExecutingOfTeacher(username: string): Promise<Promise<import("../tasks/perosonal.tasks.entity").PersonalTasks>[]>;
    getAllTodoOfTeacher(username: string): Promise<Promise<import("../tasks/perosonal.tasks.entity").PersonalTasks>[]>;
    getRecentTeacher(username: string): Promise<string[]>;
    getCountOfTeacherPersonalTasks(username: string): Promise<number[]>;
}
