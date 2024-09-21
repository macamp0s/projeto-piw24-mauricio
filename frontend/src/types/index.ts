export type User = {
  id: number
  name: string
  username: string
  password: string
  email: string
  role: Role
}

export type Role = {
  id: number
  name: string
}

export type Subject = {
  id: number;
  subjectName: string;
  students?: User[];  
  notices?: Notice[]; 
}

export type Notice = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  subject: Subject | number;
};

export interface ApplicationError {
  name: string,
  message: string,
}
