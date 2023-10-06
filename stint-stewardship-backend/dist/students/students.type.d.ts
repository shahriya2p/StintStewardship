export declare class TasksWithStatusType {
    todo: string[];
    executing: string[];
    completed: string[];
    review: string[];
    finished: string[];
}
export declare class StudentsType {
    stud_id: string;
    stud_name: string;
    stud_roll: number;
    semester: number;
    username: string;
    password: string;
    tasks?: string[];
    comment?: string[];
    taskswithstatus?: TasksWithStatusType;
    personalTasks?: TasksWithStatusType;
}
