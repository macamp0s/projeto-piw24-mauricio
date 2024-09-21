import { Column, Entity, ManyToOne, ManyToMany, PrimaryGeneratedColumn, OneToMany, JoinTable} from "typeorm"
import { Role } from "./Role"
import { Subject } from "./Subject";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  username!: string

  @Column()
  email!: string

  @Column()
  password!: string

  @ManyToOne(() => Role, role => role.users)
  role!: Role;
  
  @ManyToMany(() => Subject, subject => subject.students)
  @JoinTable() 
  subject!: Subject[];
}