import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { Project } from '../../../models/project.model';
import { ProjectDataService } from '../../../services/project-data.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

interface ProjectStatusCounts {
  planned: number;
  ongoing: number;
  completed: number;
  cancelled: number;
  total: number;
}

type ProjectStatusKey = keyof Omit<ProjectStatusCounts, 'total'>;

@Component({
  selector: 'app-project-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.css']
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
  projectsByDivision: { [divisionName: string]: Project[] } = {};
  readonly statusList: ProjectStatusKey[] = ['planned', 'ongoing', 'completed', 'cancelled'];

  constructor(
    private projectDataService: ProjectDataService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const isAdmin = this.authService.isAdmin();

    this.projectDataService.getProjects().pipe(
      switchMap(allProjects => {
        if (isAdmin) {
          // If user is an admin, return all projects immediately.
          return of(allProjects);
        } else {
          // If not an admin, get the user's division and filter projects.
          return this.userService.getCurrentUserDivision().pipe(
            map(userDivision => {
              if (!userDivision) {
                return []; // Return empty array if user has no division.
              }
              // Filter projects to include only those from the user's division.
              return allProjects.filter(project => project.division.name === userDivision.name);
            })
          );
        }
      })
    ).subscribe(filteredProjects => {
      this.projects = filteredProjects;
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
      const status = project.status as ProjectStatusKey;
      if (this.statusCounts.hasOwnProperty(status)) {
        this.statusCounts[status]++;
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

  get divisionNames(): string[] {
    return Object.keys(this.projectsByDivision).sort();
  }
}
