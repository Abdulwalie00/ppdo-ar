// src/app/services/project-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, Division } from '../models/project.model';

const API_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {

  constructor(private http: HttpClient) { }

  // --- Project Methods ---

  getProjects(divisionCode?: string, status?: string): Observable<Project[]> {
    let params = new HttpParams();
    if (divisionCode) {
      params = params.set('divisionCode', divisionCode);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Project[]>(`${API_URL}/projects`, { params });
  }

  getProjectById(id: string): Observable<Project> {
    return this.http.get<Project>(`${API_URL}/projects/${id}`);
  }

  addProject(projectData: Omit<Project, 'id' | 'dateCreated' | 'dateUpdated' | 'division'> & { divisionId: string }): Observable<Project> {
    return this.http.post<Project>(`${API_URL}/projects`, projectData);
  }

  updateProject(id: string, projectData: Partial<Omit<Project, 'id' | 'dateCreated' | 'dateUpdated' | 'division'> & { divisionId: string }>): Observable<Project> {
    return this.http.put<Project>(`${API_URL}/projects/${id}`, projectData);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/projects/${id}`);
  }

  // --- Division Methods ---

  getDivisions(): Observable<Division[]> {
    return this.http.get<Division[]>(`${API_URL}/divisions`);
  }

  // --- File Upload Method ---

  /**
   * Uploads a file to the server.
   * @param file The file to upload.
   * @returns An observable with the path to the uploaded file.
   */
  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    // The backend is expected to return the URL of the uploaded file as a string
    return this.http.post(`${API_URL}/files/upload`, formData, { responseType: 'text' });
  }
}
