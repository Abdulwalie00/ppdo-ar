import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Project } from '../../../models/project.model';
import { ProjectDataService } from '../../../services/project-data.service';
import { DivisionService } from '../../../services/division.service';
import { ProjectListComponent } from '../project-list/project-list.component';

@Component({
  selector: 'app-project-division-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectListComponent],
  templateUrl: './project-division-page.component.html',
})
export class ProjectDivisionPageComponent implements OnInit, OnDestroy {
  divisionCode: string | null = null;
  division: any = null;
  projects: Project[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private projectDataService: ProjectDataService,
    private divisionService: DivisionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.divisionCode = params.get('divisionCode');
        if (this.divisionCode) {
          this.division = this.divisionService.getDivisionByCode(this.divisionCode);
          // Fetch projects for the new division code
          return this.projectDataService.getProjects(this.divisionCode);
        } else {
          // If no division code, return an empty array
          return [];
        }
      }),
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.projects = data;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
