import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core'; // Added OnChanges, SimpleChanges
import { CommonModule, DatePipe, Location  } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs'; // Added BehaviorSubject
import { Project } from '../../../models/project.model';
import { ProjectDataService } from '../../../services/project-data.service';
import { switchMap, map, takeUntil } from 'rxjs/operators'; // Added operators
import { Subject } from 'rxjs'; // For OnDestroy cleanup

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit, OnChanges { // Implement OnChanges
  // New input to accept projects from a parent component (e.g., ProjectDivisionPageComponent)
  @Input() inputProjects: Project[] | null = null;

  allProjects: Project[] = []; // Stores all projects (either fetched or from input)
  filteredProjects: Project[] = []; // Projects currently displayed after filtering
  currentFilterStatus: string | null = null; // Stores the status from the URL query param

  @Input() showAddButton: boolean = true;
  @Input() currentDivisionCode: string | null = null;

  private destroy$ = new Subject<void>(); // Used for unsubscribing observables

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectDataService: ProjectDataService,
  private location: Location
  ) {}

  ngOnInit(): void {
    // Listen for changes in URL query parameters (status filter)
    this.route.queryParamMap.pipe(
      takeUntil(this.destroy$) // Ensure unsubscription on destroy
    ).subscribe(params => {
      this.currentFilterStatus = params.get('status');
      this.loadProjectsAndApplyFilter(); // Re-load/re-filter whenever status param changes
    });
  }

  // This lifecycle hook detects changes to @Input properties
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inputProjects']) {
      // If inputProjects changes, re-load and re-filter
      this.loadProjectsAndApplyFilter();
    }
  }

  private loadProjectsAndApplyFilter(): void {
    if (this.inputProjects !== null) {
      // If projects are provided via input, use them directly
      this.allProjects = this.inputProjects;
      this.applyFilter();
    } else {
      // Otherwise, fetch all projects from the service
      this.projectDataService.getProjects().pipe(
        takeUntil(this.destroy$)
      ).subscribe(projects => {
        this.allProjects = projects;
        this.applyFilter();
      });
    }
  }

  // Applies the filter based on currentFilterStatus to allProjects
  applyFilter(): void {
    if (this.currentFilterStatus) {
      this.filteredProjects = this.allProjects.filter(project =>
        project.status === this.currentFilterStatus
      );
    } else {
      // If no status filter from URL, show all projects from allProjects
      this.filteredProjects = [...this.allProjects];
    }
  }

  // Helper to get a user-friendly display name for the status
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
    // The queryParamMap subscription will detect this change and re-call loadProjectsAndApplyFilter
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    this.router.navigate(['/project-dashboard']); // This will navigate to the specific route you want
  }
}
