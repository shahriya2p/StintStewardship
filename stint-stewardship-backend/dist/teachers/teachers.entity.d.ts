declare class TaskWithStatus {
    todo: string[];
    executing: string[];
    completed: string[];
    review: string[];
    finished: string[];
}
export declare class Teachers {
    _id: string;
    teacher_id: string;
    teacher_name: string;
    username: string;
    password: string;
    teacher_subject: string;
    subject_code: number;
    assigned_tasks?: string[];
    personalTasks?: TaskWithStatus;
    role: 'teacher';
}
export {};
