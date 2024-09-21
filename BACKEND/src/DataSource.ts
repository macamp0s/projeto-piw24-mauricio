import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from './entity/User'
import { Role } from './entity/Role'
import { Subject } from "./entity/Subject"
import { Notice } from "./entity/Notice"

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "mydatabase.sqlite",
  synchronize: true,
  entities: [User, Role, Subject, Notice]
})