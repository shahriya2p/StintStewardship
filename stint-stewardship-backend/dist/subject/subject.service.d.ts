import { Subject } from './subject.entity';
import { Repository } from 'typeorm';
import { CreateSubjectInput } from './create-subject.input';
export declare class SubjectService {
    private subjectRepository;
    constructor(subjectRepository: Repository<Subject>);
    createSubject(createSubjectInput: CreateSubjectInput): Promise<Subject>;
    getSubjects(): Promise<Subject[]>;
    getSubjectById(subject_code: number): Promise<Subject>;
    getSubjectByName(sub_name: string): Promise<Subject>;
    deleteSubject(id: string): Promise<boolean>;
}
