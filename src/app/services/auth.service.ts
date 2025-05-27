import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type UserRole = 'Admin' | 'Editor' | 'Viewer' | 'Manager';

export interface User {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  username: string;
  passwordHash: string;
  role: 'Admin' | 'Editor' | 'Viewer' | 'Manager';
  createdAt: Date;
  updatedAt: Date;
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  users: User[] = [
    {
      id: 1,
      firstName: 'Alice',
      middleName: 'L.',
      lastName: 'Santos',
      email: 'alice@example.com',
      username: 'alice',
      passwordHash: 'alice123',
      role: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      firstName: 'Bob',
      middleName: 'S.',
      lastName: 'Ramirez',
      email: 'bob@example.com',
      username: 'bob',
      passwordHash: 'bob123',
      role: 'Editor',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 1,
      firstName: 'Alice',
      middleName: 'L.',
      lastName: 'Santos',
      email: 'alice@example.com',
      username: 'alice',
      passwordHash: 'alice123',
      role: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      firstName: 'Jace',
      middleName: 'C.',
      lastName: 'Ramz',
      email: 'bob@example.com',
      username: 'jace',
      passwordHash: 'jace123',
      role: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];


  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch {
        localStorage.removeItem('user');
      }
    }
  }

  login(username: string, password: string): boolean {
    const user = this.users.find(
      u => u.username === username && u.passwordHash === password
    );

    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    }

    return false;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('user');
  }

  getUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  get usersList(): User[] {
    return this.users;
  }

  addUser(user: User): void {
    this.users.push(user);
    console.log('✅ User added:', user);
  }

  updateUser(id: number, updatedData: Partial<User>): void {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = {
        ...this.users[index],
        ...updatedData,
        updatedAt: new Date(),
      };
      console.log('✅ User updated:', this.users[index]);
    } else {
      console.warn(`❌ User with ID ${id} not found. Update failed.`);
    }
  }


  deleteUser(id: number): void {
    this.users = this.users.filter(user => user.id !== id);
  }

  generateNextId(): number {
    return this.users.length > 0
      ? Math.max(...this.users.map(u => u.id)) + 1
      : 1;
  }

}
