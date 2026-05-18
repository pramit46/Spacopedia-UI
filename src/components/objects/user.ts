import { Role } from './role';

export interface User {
  id: string;
  name: string;
  role: Role;
}


export const USERS: User[] = [
  { id: 'u1', name: 'Pramit Owner', role: 'owner' },
  { id: 'u2', name: 'Alice Client', role: 'client' },
  { id: 'u3', name: 'Bob Accounts', role: 'accounts' },
  { id: 'u4', name: 'Charlie Project', role: 'project' },
  { id: 'u5', name: 'David Sales', role: 'sales' },
  { id: 'u6', name: 'Eve Designer', role: 'designer' },
  { id: 'u7', name: 'Frank Legal', role: 'legal' },
];
