import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm";
import { User } from "./User";
import { Notice } from "./Notice";

@Entity()
export class Subject {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  subjectName!: string;

  @ManyToMany(() => User, user => user.subject)
  students!: User[];

  @OneToMany(() => Notice, notice => notice.subject)
  notices!: Notice[];
}