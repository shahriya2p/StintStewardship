declare class TaskWithStatus {
    todo: string[];
    executing: string[];
    completed: string[];
    review: string[];
    finished: string[];
}
export declare class Students {
    _id: string;
    stud_id: string;
    stud_name: string;
    stud_roll: number;
    semester: number;
    username: string;
    password: string;
    tasks?: string[];
    comment?: string[];
    role: 'student';
    taskwithstatus?: TaskWithStatus;
    personalTasks?: TaskWithStatus;
}
export {};
