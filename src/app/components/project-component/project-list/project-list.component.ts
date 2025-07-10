import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Project } from '../../../models/project.model';
import { ProjectDataService } from '../../../services/project-data.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit, OnChanges {
  @Input() inputProjects: Project[] | null = null;
  allProjects: Project[] = [];
  filteredProjects: Project[] = [];
  currentFilterStatus: string | null = null;
  @Input() showAddButton: boolean = true;
  @Input() currentDivisionCode: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectDataService: ProjectDataService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.currentFilterStatus = params.get('status');
      this.currentDivisionCode = params.get('division');
      this.loadProjectsAndApplyFilter();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputProjects']) {
      this.loadProjectsAndApplyFilter();
    }
  }

  private loadProjectsAndApplyFilter(): void {
    if (this.inputProjects !== null) {
      this.allProjects = this.inputProjects;
      this.applyFilter();
    } else {
      this.projectDataService.getProjects(this.currentDivisionCode ?? undefined).pipe(
        takeUntil(this.destroy$)
      ).subscribe(projects => {
        this.allProjects = projects;
        this.applyFilter();
      });
    }
  }

  applyFilter(): void {
    let projectsToFilter = [...this.allProjects];

    if (this.currentFilterStatus) {
      projectsToFilter = projectsToFilter.filter(project =>
        project.status === this.currentFilterStatus
      );
    }
    this.filteredProjects = projectsToFilter;
  }

  getStatusDisplayName(status: string): string {
    switch (status) {
      case 'planned': return 'Planned';
      case 'ongoing': return 'Ongoing';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown Status';
    }
  }

  goToAddProject(): void {
    if (this.currentDivisionCode) {
      this.router.navigate(['/project-add'], { queryParams: { division: this.currentDivisionCode } });
    } else {
      this.router.navigate(['/project-add']);
    }
  }

  viewProjectDetails(projectId: string): void {
    this.router.navigate(['/project-detail', projectId]);
  }

  resetFilter(): void {
    this.currentFilterStatus = null;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { status: null },
      queryParamsHandling: 'merge'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    this.router.navigate(['/project-dashboard']);
  }
}
