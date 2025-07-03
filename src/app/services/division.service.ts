import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Division} from '../models/project.model';

const API_URL = 'http://localhost:8080/api/divisions';

@Injectable({
  providedIn: 'root'
})
export class DivisionService {

  constructor(private http: HttpClient) { }

  getDivisions(): Observable<Division[]> {
    return this.http.get<Division[]>(API_URL);
  }

  getDivisionById(id: string): Observable<Division> {
    return this.http.get<Division>(`${API_URL}/${id}`);
  }

  createDivision(division: Omit<Division, 'id' | 'dateCreated' | 'dateUpdated'>): Observable<Division> {
    return this.http.post<Division>(API_URL, division);
  }

  updateDivision(id: string, updatedData: Partial<Division>): Observable<Division> {
    return this.http.put<Division>(`${API_URL}/${id}`, updatedData);
  }

  deleteDivision(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
