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
  @Input() showAddButton: boolean = true;
  @Input() currentDivisionCode: string | null = null;

  allProjects: Project[] = [];
  filteredProjects: Project[] = [];
  currentFilterStatus: string | null = null;
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
      this.applyFilter(); // Apply the filter when query params change
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // When the inputProjects change, update the local list and apply the filter
    if (changes['inputProjects'] && this.inputProjects) {
      this.allProjects = this.inputProjects;
      this.applyFilter();
    }
  }

  applyFilter(): void {
    let projectsToFilter = this.allProjects ? [...this.allProjects] : [];

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
