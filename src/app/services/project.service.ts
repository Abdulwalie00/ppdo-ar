import { Injectable } from '@angular/core';
import { Project, Division, ProjectImage } from '../models/project.model';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [];
  private divisions: Division[] = [
    {
      id: 'div1',
      name: 'Engineering',
      code: 'ENG',
      dateCreated: new Date('2023-01-01'),
      dateUpdated: new Date('2023-01-01')
    },
    {
      id: 'div2',
      name: 'Construction',
      code: 'CON',
      dateCreated: new Date('2023-01-01'),
      dateUpdated: new Date('2023-01-01')
    },
    {
      id: 'div3',
      name: 'Design',
      code: 'DES',
      dateCreated: new Date('2023-01-01'),
      dateUpdated: new Date('2023-01-01')
    }
  ];

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    this.projects = [
      {
        id: 'proj1',
        title: 'City Bridge Construction',
        description: 'Construction of a new bridge across the river',
        location: 'Downtown Area',
        startDate: new Date('2023-03-01'),
        endDate: new Date('2023-12-31'),
        dateCreated: new Date('2023-01-15'),
        dateUpdated: new Date('2023-01-15'),
        budget: 5000000,
        fundSource: 'Municipal Budget',
        division: this.divisions[0],
        images: [],
        status: 'ongoing'
      },
      {
        id: 'proj2',
        title: 'Public Park Renovation',
        description: 'Renovation of the central public park',
        location: 'City Center',
        startDate: new Date('2023-05-01'),
        endDate: new Date('2023-08-31'),
        dateCreated: new Date('2023-02-10'),
        dateUpdated: new Date('2023-02-10'),
        budget: 1200000,
        fundSource: 'State Grant',
        division: this.divisions[1],
        images: [],
        status: 'planned'
      },
      {
        id: 'proj3',
        title: 'Road Widening Project',
        description: 'Widening of Main Street to 4 lanes',
        location: 'Main Street',
        startDate: new Date('2023-01-15'),
        endDate: new Date('2023-06-30'),
        dateCreated: new Date('2022-12-01'),
        dateUpdated: new Date('2022-12-01'),
        budget: 2500000,
        fundSource: 'Federal Funding',
        division: this.divisions[2],
        images: [],
        status: 'completed'
      }
    ];
  }

  getProjects() {
    return of([...this.projects]);
  }

  getProjectById(id: string) {
    const project = this.projects.find(p => p.id === id);
    return of(project ? {...project} : null);
  }

  addProject(project: Project): Observable<Project> {
    project.id = 'proj' + (this.projects.length + 1);
    project.dateCreated = new Date();
    project.dateUpdated = new Date();
    this.projects.push({...project});
    return of({...project});
  }

  updateProject(updatedProject: Project): Observable<Project | null> {
    const index = this.projects.findIndex(p => p.id === updatedProject.id);
    if (index !== -1) {
      updatedProject.dateUpdated = new Date();
      this.projects[index] = {...updatedProject};
      return of({...updatedProject});
    }
    return of(null);
  }

  deleteProject(id: string): Observable<boolean> {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  getDivisions() {
    return of([...this.divisions]);
  }
}
