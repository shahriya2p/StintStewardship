import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './subject.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateSubjectInput } from './create-subject.input';

@Injectable()
export class SubjectService {
  constructor(
    @InjectRepository(Subject) private subjectRepository: Repository<Subject>,
  ) {}

  async createSubject(
    createSubjectInput: CreateSubjectInput,
  ): Promise<Subject> {
    const { sub_code, sub_name, sub_of_sem } = createSubjectInput;
    const subject = this.subjectRepository.create({
      subject_id: uuid(),
      sub_code,
      sub_name,
      sub_of_sem,
    });
    return await this.subjectRepository.save(subject);
  }

  async getSubjects(): Promise<Subject[]> {
    return await this.subjectRepository.find();
  }

  async getSubjectById(subject_code: number): Promise<Subject> {
    return await this.subjectRepository.findOneBy({ sub_code: subject_code });
  }

  async getSubjectByName(sub_name: string): Promise<Subject> {
    return await this.subjectRepository.findOneBy({ sub_name: sub_name });
  }

  async deleteSubject(id: string) {
    const subject_to_delete = await this.subjectRepository.findOne({
      where: { subject_id: id },
    });
    if (subject_to_delete) {
      const result = await this.subjectRepository.delete(subject_to_delete._id);
      return result.affected > 0;
    } else {
      return false;
    }
  }
}
