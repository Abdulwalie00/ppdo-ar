// src/app/pages/project-division-page/project-division-page.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, of } from 'rxjs';
import { ProjectListComponent } from '../project-list/project-list.component';
import { Project } from '../../../models/project.model';
import { ProjectDataService } from '../../../services/project-data.service';

@Component({
  selector: 'app-project-division-page',
  standalone: true,
  imports: [CommonModule, ProjectListComponent],
  templateUrl: './project-division-page.component.html',
  styleUrl: './project-division-page.component.css'
})
export class ProjectDivisionPageComponent implements OnInit {
  divisionCode: string | null = null;
  divisionName: string = 'Loading...';
  projects$!: Observable<Project[]>;

  constructor(
    private route: ActivatedRoute,
    private projectDataService: ProjectDataService
  ) {}

  ngOnInit(): void {
    // This stream handles fetching the projects based on the division code in the URL
    this.projects$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.divisionCode = params.get('divisionCode');
        if (this.divisionCode) {
          // Fetch the division's name for the header
          this.projectDataService.getDivisions().subscribe(divisions => {
            const currentDivision = divisions.find(d => d.code === this.divisionCode);
            this.divisionName = currentDivision ? currentDivision.name : 'Unknown Division';
          });
          // Fetch the projects for the current division
          return this.projectDataService.getProjects(this.divisionCode);
        }
        // If no division code is found, display a default name and return no projects
        this.divisionName = 'All Divisions';
        return of([]);
      })
    );
  }
}
