export declare class TasksWithStatusTypeForTeacher {
    todo: string[];
    executing: string[];
    completed: string[];
    review: string[];
    finished: string[];
}
export declare class TeachersType {
    teacher_id: string;
    teacher_name: string;
    teacher_subject: string;
    subject_code: number;
    assigned_tasks?: string[];
    personalTasks?: TasksWithStatusTypeForTeacher;
}
