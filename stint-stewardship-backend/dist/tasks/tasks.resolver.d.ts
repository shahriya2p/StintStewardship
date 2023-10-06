import { TasksService } from './tasks.service';
import { Tasks } from './tasks.entity';
import { CreateTasksType } from './create-tasks.input';
import { CreateCustomTasksType } from './task-custom.input.type';
export declare class TasksResolver {
    private tasksService;
    constructor(tasksService: TasksService);
    createTask(createTasksType: CreateTasksType): Promise<Tasks>;
    getTasks(): Promise<Tasks[]>;
    deleteTask(id: string): Promise<boolean>;
    deletePersonalTaskForStudent(name: string, username: string): Promise<boolean>;
    deletePersonalTaskForTeacher(name: string, username: string): Promise<boolean>;
    createTaskForPersonal(createCustomTasksInput: CreateCustomTasksType): Promise<import("./perosonal.tasks.entity").PersonalTasks>;
    getTasksByTeacher(username: string): Promise<Tasks[]>;
    searchTasks(task_name: string, username: string): Promise<Tasks[]>;
    searchPersonalTasks(task_name: string, username: string): Promise<import("./perosonal.tasks.entity").PersonalTasks[]>;
    checkDeadlines(): Promise<any>;
    handle(): void;
}
