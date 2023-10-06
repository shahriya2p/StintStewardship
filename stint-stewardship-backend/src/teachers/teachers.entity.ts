/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class TaskWithStatus {
  @Column({ nullable: true })
  todo: string[];

  @Column({ nullable: true })
  executing: string[];

  @Column({ nullable: true })
  completed: string[];

  @Column({ nullable: true })
  review: string[];

  @Column({ nullable: true })
  finished: string[];
}

@Entity('Teachers')
export class Teachers {
  @ObjectIdColumn()
  _id: string;

  @PrimaryGeneratedColumn('uuid')
  @Column({ unique: true })
  teacher_id: string;

  @Column()
  teacher_name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  teacher_subject: string;

  @Column()
  subject_code: number;

  @Column({ nullable: true })
  assigned_tasks?: string[];

  @Column({ nullable: true })
  personalTasks?: TaskWithStatus;

  @Column()
  role: 'teacher';
}
