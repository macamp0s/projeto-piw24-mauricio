import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import {Role} from './Role'

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

    @ManyToOne(()=>Role, role => role.users)
    role!: Role
}