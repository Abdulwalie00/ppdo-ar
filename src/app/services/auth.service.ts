import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

const API_URL = 'http://localhost:8080/api/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  private userRolesSubject = new BehaviorSubject<string[]>(this.getRolesFromToken());

  constructor(private http: HttpClient) { }

  login(credentials: { username: string, password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(API_URL + 'auth/login', credentials).pipe(
      tap(response => {
        localStorage.setItem('authToken', response.token);
        this.isAuthenticatedSubject.next(true);
        this.userRolesSubject.next(this.getRolesFromToken()); // Update roles on login
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
    this.userRolesSubject.next([]);
  }

  // New methods for role management
  getRoles(): string[] {
    return this.getRolesFromToken();
  }

  isAdmin(): boolean {
    return this.getRoles().includes('ROLE_ADMIN');
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get userRoles$(): Observable<string[]> {
    return this.userRolesSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private getRolesFromToken(): string[] {
    const token = this.getToken();
    if (!token) return [];

    try {
      const decoded: any = jwtDecode(token);
      // Handle both string[] and object[] role formats
      const roles = decoded.roles || [];

      if (roles.length > 0 && typeof roles[0] === 'object') {
        return roles.map((r: any) => r.authority || r.role);
      }
      return roles;
    } catch (e) {
      console.error('Error decoding token', e);
      return [];
    }
  }
}
