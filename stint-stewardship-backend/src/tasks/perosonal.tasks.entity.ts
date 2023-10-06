/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('PersonalTasks')
export class PersonalTasks {
  @ObjectIdColumn()
  _id: string;

  @PrimaryGeneratedColumn('uuid')
  tasks_id: string;

  @Column()
  username: string;

  @Column({ nullable: false })
  task_name: string;

  @Column({ nullable: true })
  content: string[];

  @Column({ nullable: true })
  alloted_user?: string;

  @Column({ nullable: true })
  created_date: string;

  @Column({ nullable: true })
  deadline?: string;
}
