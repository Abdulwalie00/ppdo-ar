// src/app/services/project-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Project, Division, ProjectImage } from '../models/project.model';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid @types/uuid

@Injectable({
  providedIn: 'root'
})
export class ProjectDataService {
  private projectsSubject = new BehaviorSubject<Project[]>([]);
  projects$: Observable<Project[]> = this.projectsSubject.asObservable();

  private divisions: Division[] = [
    { id: '1', name: 'Office of the Provincial Governor', code: 'PGO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '2', name: 'Provincial Tourism, Culture and Arts Office', code: 'PTCAO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '3', name: 'Provincial Development Division', code: 'PDD', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '4', name: 'Information and Communications Technology Office', code: 'ICTO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '5', name: 'Rural Youth Development Office', code: 'RYDO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '6', name: 'Provincial Welfare Office', code: 'PWO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '7', name: 'Provincial Livelihood and Productivity Program', code: 'PLPP', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '8', name: 'Provincial Training, Livelihood, and Development Center', code: 'PTLDC', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '9', name: 'Local Economic Development and Investment Promotion Office', code: 'LEDIPO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '10', name: 'Gender and Development Office', code: 'GAD', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '11', name: 'Office of the Vice Governor', code: 'OPVG', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '12', name: 'Provincial Engineer\'s Office', code: 'PEO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '13', name: 'Public Information Office', code: 'PIO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '14', name: 'Provincial Cooperative Office', code: 'PCO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '15', name: 'Office of the Provincial Agriculturist', code: 'OPAG', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '16', name: 'Provincial Environment and Natural Resources Office', code: 'PENRO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '17', name: 'Provincial Social Welfare and Development Office', code: 'PSWDO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '18', name: 'Provincial Health Office', code: 'PHO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '19', name: 'Provincial Veterinary Office', code: 'PVO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '20', name: 'Provincial Planning and Development Office', code: 'PPDO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '21', name: 'Provincial Human Resource Management Office', code: 'PHRMO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '22', name: 'Provincial General Services Office', code: 'PGSO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '23', name: 'Provincial Treasurer\'s Office', code: 'PTO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '24', name: 'Provincial Accounting Office', code: 'PACCO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '25', name: 'Provincial Budget Office', code: 'PBO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '26', name: 'Provincial Legal Services Office', code: 'PLSO', dateCreated: new Date(), dateUpdated: new Date() },
    { id: '27', name: 'Provincial Security Force', code: 'PSF', dateCreated: new Date(), dateUpdated: new Date() }
  ];

  constructor() {
    // Load initial dummy data (or from localStorage if you want persistence)
    this.loadInitialData();
  }

  private loadInitialData(): void {
    const dummyProjects: Project[] = [
      {
        id: uuidv4(),
        title: 'Project Build Community Center',
        description: 'Construction of a new community center in Barangay San Jose.',
        location: 'Brgy. San Jose, Marawi City',
        startDate: new Date('2023-01-15'),
        endDate: new Date('2024-03-30'),
        dateCreated: new Date(),
        dateUpdated: new Date(),
        budget: 5000000,
        fundSource: 'LGU Fund',
        division: this.divisions.find(d => d.code === 'PEO')!,
        images: [],
        status: 'ongoing'
      },
      {
        id: uuidv4(),
        title: 'Project Tourism Promotion Campaign',
        description: 'Digital and traditional media campaign to boost local tourism.',
        location: 'Marawi City',
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-12-31'),
        dateCreated: new Date(),
        dateUpdated: new Date(),
        budget: 1500000,
        fundSource: 'DOT Grant',
        division: this.divisions.find(d => d.code === 'PTCAO')!,
        images: [],
        status: 'planned'
      },
      {
        id: uuidv4(),
        title: 'Project E-Governance System Development',
        description: 'Development and implementation of a new e-governance platform.',
        location: 'Provincial Capitol',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2025-06-30'),
        dateCreated: new Date(),
        dateUpdated: new Date(),
        budget: 3000000,
        fundSource: 'Provincial Budget',
        division: this.divisions.find(d => d.code === 'ICTO')!,
        images: [],
        status: 'ongoing'
      },
      {
        id: uuidv4(),
        title: 'Project HR Skill Enhancement Workshop',
        description: 'Series of workshops for provincial employees on modern HR practices.',
        location: 'Provincial Training Center',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-07-15'),
        dateCreated: new Date(),
        dateUpdated: new Date(),
        budget: 200000,
        fundSource: 'HRMO Budget',
        division: this.divisions.find(d => d.code === 'PHRMO')!,
        images: [],
        status: 'planned'
      }
    ];
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
