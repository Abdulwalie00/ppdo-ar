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
  private users: User[] = [
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
  ];

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, password: string): boolean {
    // In a real app, you’d validate password too
    const user = this.users.find(u => u.username === username);
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
    return !!this.currentUserSubject.value;
  }
}
