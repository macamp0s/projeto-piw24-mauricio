import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { readUsersFromFile, writeUsersToFile } from '../services/userService';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users: User[] = await readUsersFromFile();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error reading users', error });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser: User = req.body;
    const users: User[] = await readUsersFromFile();
    users.push(newUser);
    await writeUsersToFile(users);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};