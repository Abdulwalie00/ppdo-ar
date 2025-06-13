// src/app/components/project-detail/project-detail.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core'; // Added OnDestroy
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe, Location } from '@angular/common'; // Added DatePipe and Location
import { ProjectConfirmationDialogComponent } from '../project-confirmation-dialog/project-confirmation-dialog.component';
import { ProjectDataService } from '../../../services/project-data.service';
import { Project } from '../../../models/project.model';
import { Observable, Subject, of } from 'rxjs'; // Added Observable, Subject, of
import { switchMap, takeUntil, tap } from 'rxjs/operators'; // Added operators

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectConfirmationDialogComponent, DatePipe], // Added DatePipe
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit, OnDestroy { // Implement OnDestroy
  project$: Observable<Project | undefined>; // Using an Observable for project data
  currentProject: Project | undefined; // To hold the resolved project for actions like edit/delete

  // Confirmation dialog properties
  showConfirmationDialog: boolean = false;
  dialogMessage: string = '';
  dialogAction: 'delete' | '' = '';

  private destroy$ = new Subject<void>(); // Used for managing observable subscriptions

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectDataService: ProjectDataService,
    private location: Location // Inject Location service
  ) {
    // Initialize project$ here to ensure it's always an Observable
    this.project$ = of(undefined); // Start with undefined until data is loaded
  }

  ngOnInit(): void {
    this.project$ = this.route.paramMap.pipe(
      switchMap(params => {
        const projectId = params.get('id');
        if (projectId) {
          // Fetch project by ID
          return this.projectDataService.getProjectById(projectId);
        }
        // If no ID in route, return an observable that emits undefined
        return of(undefined);
      }),
      // Use tap to capture the emitted project value for local component use
      tap(project => {
        this.currentProject = project; // Store the project for actions like edit/delete
        if (!project) {
          // If project not found, navigate back to list after a brief delay
          // A timeout can prevent navigation issues if triggered too quickly
          setTimeout(() => {
            this.router.navigate(['/project-list']);
          }, 0);
        }
      }),
      takeUntil(this.destroy$) // Automatically unsubscribe when component is destroyed
    );
  }

  // --- Action Methods ---

  editProject(): void {
    if (this.currentProject) {
      this.router.navigate(['/project-edit', this.currentProject.id]);
    }
  }

  confirmDelete(): void {
    if (!this.currentProject) {
      console.warn('No project loaded to delete.');
      return;
    }
    this.dialogMessage = `Are you sure you want to delete project "${this.currentProject.title}"? This action cannot be undone.`;
    this.dialogAction = 'delete';
    this.showConfirmationDialog = true;
  }

  onConfirmation(confirmed: boolean): void {
    this.showConfirmationDialog = false; // Close the dialog
    if (confirmed && this.dialogAction === 'delete' && this.currentProject) {
      this.projectDataService.deleteProject(this.currentProject.id).pipe(
        takeUntil(this.destroy$) // Ensure deletion subscription is cleaned up
      ).subscribe(success => {
        if (success) {
          console.log(`Project with ID ${this.currentProject?.id} deleted successfully.`);
          this.router.navigate(['/project-list']); // Go back to list after successful deletion
        } else {
          console.error('Failed to delete project.');
          // TODO: Implement user-friendly error notification (e.g., a toast message)
        }
      });
    }
  }

  printSummary(): void {
    // This is a basic print functionality. For more complex reports,
    // consider using a library like jsPDF or generating a dedicated print view.
    window.print();
  }

  // New method to go back to the previous page in history
  goBack(): void {
    this.location.back();
  }

  // --- Lifecycle Hook for Cleanup ---
  ngOnDestroy(): void {
    this.destroy$.next(); // Emit a value to signal completion
    this.destroy$.complete(); // Complete the Subject
  }
}
