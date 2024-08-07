import { promises as fs } from 'fs';
import { User } from '../models/userModel';
import * as path from 'path';

const filePath = path.join(__dirname, '../data/users.json');

export const readUsersFromFile = async (): Promise<User[]> => {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

export const writeUsersToFile = async (users: User[]): Promise<void> => {
  await fs.writeFile(filePath, JSON.stringify(users, null, 2));
};