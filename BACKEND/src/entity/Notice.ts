import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Subject } from "./Subject";

@Entity()
export class Notice {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })  
  createdAt!: Date;

  @ManyToOne(() => Subject, subject => subject.notices)
  subject!: Subject;
}