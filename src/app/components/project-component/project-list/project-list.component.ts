import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Subject, switchMap } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Project } from '../../../models/project.model';
import { ProjectDataService } from '../../../services/project-data.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit, OnDestroy {
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
    public authService: AuthService // Make AuthService public
  ) {}

  ngOnInit(): void {
    // If projects are not passed as input, fetch them from the service
    if (!this.inputProjects) {
      this.route.queryParamMap.pipe(
        switchMap(params => {
          this.currentFilterStatus = params.get('status');
          const divisionCode = params.get('division');
          return this.projectDataService.getProjects(divisionCode ?? undefined, this.currentFilterStatus ?? undefined);
        }),
        takeUntil(this.destroy$)
      ).subscribe(projects => {
        this.allProjects = projects;
        this.applyFilter(); // Filter the newly fetched projects
      });
    }
  }

  ngOnChanges(): void {
    // When the inputProjects change (if provided), update the list and filter
    if (this.inputProjects) {
      this.allProjects = this.inputProjects;
      this.applyFilter();
    }
  }

  applyFilter(): void {
    if (this.currentFilterStatus) {
      this.filteredProjects = this.allProjects.filter(project =>
        project.status === this.currentFilterStatus
      );
    } else {
      this.filteredProjects = this.allProjects;
    }
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
    // Preserve the division filter if it exists
    const division = this.route.snapshot.queryParamMap.get('division');
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { status: null, division: division },
      queryParamsHandling: 'merge' // keeps other query params
    });
  }

  goBack(): void {
    this.router.navigate(['/project-dashboard']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
