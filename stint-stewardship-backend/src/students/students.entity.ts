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

@Entity('Students')
export class Students {
  @ObjectIdColumn()
  _id: string;

  @PrimaryGeneratedColumn('uuid')
  stud_id: string;

  @Column()
  stud_name: string;

  @Column()
  stud_roll: number;

  @Column()
  semester: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // @ManyToOne(() => Tasks, (tasks) => tasks.task_name, { eager: true })
  @Column({ nullable: true })
  tasks?: string[];

  @Column({ nullable: true })
  comment?: string[];

  @Column()
  role: 'student';

  @Column({ nullable: true })
  taskwithstatus?: TaskWithStatus;

  @Column({ nullable: true })
  personalTasks?: TaskWithStatus;
}
