// src/app/components/project-division-page/project-division-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProjectListComponent } from '../project-list/project-list.component';
import {CommonModule} from '@angular/common';
import {ProjectDataService} from '../../../services/project-data.service';
import {Project} from '../../../models/project.model';

@Component({
  selector: 'app-project-division-page',
  standalone: true,
  imports: [CommonModule, ProjectListComponent],
  templateUrl: './project-division-page.component.html',
  styleUrl: './project-division-page.component.css'
})
export class ProjectDivisionPageComponent implements OnInit {
  divisionCode: string = '';
  projects$: Observable<Project[]> | undefined;
  divisionName: string = '';

  constructor(
    private route: ActivatedRoute,
    private projectDataService: ProjectDataService
  ) {}

  ngOnInit(): void {
    this.projects$ = this.route.paramMap.pipe(
      map(params => {
        this.divisionCode = params.get('divisionCode') || '';
        const division = this.projectDataService.getDivisionByCode(this.divisionCode);
        this.divisionName = division ? division.name : 'Unknown Division';
        return this.divisionCode;
      }),
      switchMap(code => this.projectDataService.getProjectsByDivision(code))
    );
  }
}
