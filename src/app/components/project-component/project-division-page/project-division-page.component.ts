// Assuming your ProjectDivisionPageComponent looks something like this:
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, of, filter, map } from 'rxjs';
import { ProjectListComponent } from '../project-list/project-list.component';
import {Project} from '../../../models/project.model';
import {ProjectDataService} from '../../../services/project-data.service'; // Import ProjectListComponent

@Component({
  selector: 'app-project-division-page',
  standalone: true,
  imports: [CommonModule, ProjectListComponent], // Ensure ProjectListComponent is imported
  templateUrl: './project-division-page.component.html',
  styleUrl: './project-division-page.component.css'
})
export class ProjectDivisionPageComponent implements OnInit {
  divisionCode: string | null = null;
  divisionName: string = '';
  projects$!: Observable<Project[]>; // Observable holding projects for this division

  constructor(
    private route: ActivatedRoute,
    private projectDataService: ProjectDataService
  ) {}

  ngOnInit(): void {
    this.projects$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.divisionCode = params.get('divisionCode');
        if (this.divisionCode) {
          // Find the division name
          const division = this.projectDataService.getDivisionByCode(this.divisionCode);
          this.divisionName = division ? division.name : 'Unknown Division';
          // Fetch projects for this specific division
          return this.projectDataService.getProjectsByDivision(this.divisionCode);
        }
        this.divisionName = 'All Divisions'; // Fallback or if no division code
        return of([]); // Return empty if no division code
      })
    );
  }
}
