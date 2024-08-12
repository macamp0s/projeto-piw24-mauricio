import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { readUsersFromFile, writeUsersToFile } from '../services/userService';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users: User[] = await readUsersFromFile();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao ler usuários', error });
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
    res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
};



export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id, 10);
    const updatedData: Partial<User> = req.body;

    let users: User[] = await readUsersFromFile();
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      res.status(404).json({ message: 'Erro Usuário não encontrado no banco' });
      return;
    }

    users[userIndex] = { ...users[userIndex], ...updatedData };
    await writeUsersToFile(users);
    
    res.status(200).json(users[userIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error ao atualizar', error });
  }
};



export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id, 10);

    let users: User[] = await readUsersFromFile();
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      res.status(404).json({ message: 'Erro Usuário não encontrado no banco' });
      return;
    }

    users = users.filter(user => user.id !== userId);
    await writeUsersToFile(users);

    res.status(200).json({ message: 'Usuário deletado' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar', error });
  }
};