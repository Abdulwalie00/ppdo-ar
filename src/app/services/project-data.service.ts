// src/app/services/project-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Project, Division, ProjectCategory, ProjectCategoryDto} from '../models/project.model';

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

  // --- Project Category Methods ---

  getProjectCategories(divisionId?: string): Observable<ProjectCategory[]> {
    let params = new HttpParams();
    if (divisionId) {
      params = params.set('divisionId', divisionId);
    }
    return this.http.get<ProjectCategory[]>(`${API_URL}/project-categories`, { params });
  }

  addProjectCategory(categoryData: ProjectCategoryDto): Observable<ProjectCategory> {
    return this.http.post<ProjectCategory>(`${API_URL}/project-categories`, categoryData);
  }

  updateProjectCategory(id: string, categoryData: ProjectCategoryDto): Observable<ProjectCategory> {
    return this.http.put<ProjectCategory>(`${API_URL}/project-categories/${id}`, categoryData);
  }

  deleteProjectCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/project-categories/${id}`);
  }


  // --- File Upload Method ---

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${API_URL}/files/upload`, formData, { responseType: 'text' });
  }
}
