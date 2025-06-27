export type UserRole = 'ROLE_ADMIN' | 'ROLE_EDITOR' | 'ROLE_VIEWER' | 'ROLE_MANAGER';

export interface User {
  id: number;
  firstName: string;
  middleName?: string; // Optional
  lastName: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
