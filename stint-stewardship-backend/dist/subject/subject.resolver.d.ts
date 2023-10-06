import { SubjectService } from './subject.service';
import { Subject } from './subject.entity';
import { CreateSubjectInput } from './create-subject.input';
export declare class SubjectResolver {
    private subjectService;
    constructor(subjectService: SubjectService);
    createSubject(createSubjectInput: CreateSubjectInput): Promise<Subject>;
    getSubjects(): Promise<Subject[]>;
    getSubjectById(subject_code: number): Promise<Subject>;
    deleteSubject(id: string): Promise<boolean>;
}
