/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Subject')
export class Subject {
  @ObjectIdColumn()
  _id: string;

  @PrimaryGeneratedColumn('uuid')
  subject_id: string;

  @Column()
  sub_of_sem: number;

  @Column({ unique: true })
  sub_name: string;

  @Column({ unique: true })
  sub_code: number;
}
