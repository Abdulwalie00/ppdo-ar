// src/app/services/project-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Project, Division, ProjectImage } from '../models/project.model';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid @types/uuid
import { divisions } from '../data/divisions';
import { dummyProjects } from '../data/dummy-projects';

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  projects$: Observable<Project[]> = this.projectsSubject.asObservable();

  private divisions: Division[] = divisions;

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.projectsSubject.next(dummyProjects);
  }

  getDivisions(): Division[] {
    return this.divisions;
  }

  getProjects(): Observable<Project[]> {
    return this.projects$;
  }

  getProjectById(id: string): Observable<Project | undefined> {
    return of(this.projectsSubject.getValue().find(p => p.id === id));
  }

  getProjectsByDivision(divisionCode: string): Observable<Project[]> {
    return of(this.projectsSubject.getValue().filter(p => p.division.code === divisionCode));
  }

  addProject(project: Project): Observable<Project> {
    const currentProjects = this.projectsSubject.getValue();
    const newProject = { ...project, id: uuidv4(), dateCreated: new Date(), dateUpdated: new Date() };
    this.projectsSubject.next([...currentProjects, newProject]);
    return of(newProject);
  }

  updateProject(updatedProject: Project): Observable<Project | undefined> {
    const currentProjects = this.projectsSubject.getValue();
    const index = currentProjects.findIndex(p => p.id === updatedProject.id);

    if (index > -1) {
      const projects = [...currentProjects];
      projects[index] = { ...updatedProject, dateUpdated: new Date() };
      this.projectsSubject.next(projects);
      return of(projects[index]);
    }
    return of(undefined);
  }

  deleteProject(id: string): Observable<boolean> {
    const currentProjects = this.projectsSubject.getValue();
    const filteredProjects = currentProjects.filter(p => p.id !== id);
    if (filteredProjects.length !== currentProjects.length) {
      this.projectsSubject.next(filteredProjects);
      return of(true);
    }
    return of(false);
  }

  // Helper to get division by code
  getDivisionByCode(code: string): Division | undefined {
    return this.divisions.find(d => d.code === code);
  }
}
