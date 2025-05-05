import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  name: string;
  email: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    // Simulate persisted login (e.g., from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(username: string, password: string): boolean {
    // 🔐 Simulate a login
    if (username === 'admin' && password === 'admin') {
      const user: User = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        username: 'admin',
        role: 'Administrator',
      };
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
