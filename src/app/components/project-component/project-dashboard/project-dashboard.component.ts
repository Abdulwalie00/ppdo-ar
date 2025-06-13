import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs'; // For reactive programming, though we'll use subscribe directly for simplicity here
import { RouterModule } from '@angular/router';
import {Project} from '../../../models/project.model';
import {ProjectDataService} from '../../../services/project-data.service'; // For navigation links

interface ProjectStatusCounts {
  planned: number;
  ongoing: number;
  completed: number;
  cancelled: number;
  total: number;
}

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], // Import RouterModule for routerLink
  templateUrl: './project-dashboard.component.html',
  styleUrl: './project-dashboard.component.css'
})
export class ProjectDashboardComponent implements OnInit {
  projects: Project[] = [];
  statusCounts: ProjectStatusCounts = {
    planned: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0,
    total: 0
  };

  // To display projects grouped by their division
  projectsByDivision: { [divisionName: string]: Project[] } = {};

  constructor(private projectDataService: ProjectDataService) {}

  ngOnInit(): void {
    this.projectDataService.getProjects().subscribe(projects => {
      this.projects = projects;
      this.calculateStatusCounts();
      this.groupProjectsByDivision();
    });
  }

  private calculateStatusCounts(): void {
    this.statusCounts = {
      planned: 0,
      ongoing: 0,
      completed: 0,
      cancelled: 0,
      total: this.projects.length
    };

    this.projects.forEach(project => {
      switch (project.status) {
        case 'planned':
          this.statusCounts.planned++;
          break;
        case 'ongoing':
          this.statusCounts.ongoing++;
          break;
        case 'completed':
          this.statusCounts.completed++;
          break;
        case 'cancelled':
          this.statusCounts.cancelled++;
          break;
      }
    });
  }

  private groupProjectsByDivision(): void {
    this.projectsByDivision = {}; // Reset before grouping

    this.projects.forEach(project => {
      const divisionName = project.division.name;
      if (!this.projectsByDivision[divisionName]) {
        this.projectsByDivision[divisionName] = [];
      }
      this.projectsByDivision[divisionName].push(project);
    });
  }

  // Helper to get division names for *ngFor order
  get divisionNames(): string[] {
    return Object.keys(this.projectsByDivision).sort();
  }
}
