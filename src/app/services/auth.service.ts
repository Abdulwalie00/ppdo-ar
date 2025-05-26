import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  name: string;
  email: string;
  username: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  users: User[] = [
    {
      name: 'Alice Santos',
      email: 'alice@example.com',
      username: 'alice',
      password: 'alice123',
      role: 'Admin',
    },
    {
      name: 'Bob Ramirez',
      email: 'bob@example.com',
      username: 'bob',
      password: 'bob123',
      role: 'Editor',
    },
    {
      name: 'Charlie Dela Cruz',
      email: 'charlie@example.com',
      username: 'charlie',
      password: 'charlie123',
      role: 'Viewer',
    },
    {
      name: 'James Bond',
      email: 'jamesbond@example.com',
      username: 'admin',
      password: 'admin123',
      role: 'Admin',
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
      u => u.username === username && u.password === password
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

  // ✅ MISSING FUNCTIONS BELOW

  get usersList(): User[] {
    return this.users;
  }

  addUser(user: User): void {
    this.users.push(user);
  }

  updateUser(index: number, user: User): void {
    if (index >= 0 && index < this.users.length) {
      this.users[index] = user;
    }
  }

  deleteUser(index: number): void {
    if (index >= 0 && index < this.users.length) {
      this.users.splice(index, 1);
    }
  }
}
