import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Division} from '../models/project.model';
import {environment} from '../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class DivisionService {

  constructor(private http: HttpClient) { }

  getDivisions(): Observable<Division[]> {
    return this.http.get<Division[]>(`${environment.apiUrl}divisions`);
  }

  getDivisionById(id: string): Observable<Division> {
    return this.http.get<Division>(`${environment.apiUrl}divisions/${id}`);
  }

  createDivision(division: Omit<Division, 'id' | 'dateCreated' | 'dateUpdated'>): Observable<Division> {
    return this.http.post<Division>(`${environment.apiUrl}divisions`, division);
  }

  updateDivision(id: string, updatedData: Partial<Division>): Observable<Division> {
    return this.http.put<Division>(`${environment.apiUrl}divisions/${id}`, updatedData);
  }

  deleteDivision(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}divisions/${id}`);
  }
}
