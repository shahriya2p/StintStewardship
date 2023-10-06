/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  ObjectIdColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('FilesUploaded')
export class File {
  @ObjectIdColumn()
  _id: string;

  @PrimaryGeneratedColumn('uuid')
  file_id: string;

  @Column()
  stud_id: string;

  @Column()
  task_Name: string;

  @Column()
  fileName: string;

  @Column()
  type: string;
}
