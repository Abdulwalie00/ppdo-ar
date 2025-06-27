import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model'; // Adjust path if needed

const API_URL = 'http://localhost:8080/api/users/';
const API_URL2 = 'http://localhost:8080/api/manage-users';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  /**
   * Fetches a list of all users from the backend.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(API_URL2);
  }

  /**
   * Fetches a single user by their ID.
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(API_URL + id);
  }

  /**
   * Creates a new user.
   * Note: The backend handles password hashing. Send the plain password.
   */
  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password?: string }): Observable<User> {
    return this.http.post<User>(API_URL, user);
  }

  /**
   * Updates an existing user's data.
   */
  updateUser(id: number, updatedData: Partial<User>): Observable<User> {
    return this.http.put<User>(API_URL + id, updatedData);
  }

  /**
   * Deletes a user by their ID.
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(API_URL + id);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(API_URL + 'username/' + username);
  }

}
