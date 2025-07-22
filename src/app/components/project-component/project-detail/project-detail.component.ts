import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { ProjectConfirmationDialogComponent } from '../project-confirmation-dialog/project-confirmation-dialog.component';
import { ProjectDataService } from '../../../services/project-data.service';
import { Project } from '../../../models/project.model';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { SafeUrlPipe } from '../../../pipes/safe-url.pipe';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectConfirmationDialogComponent, DatePipe],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project$: Observable<Project | undefined>;
  currentProject: Project | undefined;

  showConfirmationDialog: boolean = false;
  dialogMessage: string = '';
  dialogAction: 'delete' | '' = '';

  showCarousel = false;
  currentImageIndex = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectDataService: ProjectDataService,
    private location: Location
  ) {
    this.project$ = of(undefined);
  }

  ngOnInit(): void {
    this.project$ = this.route.paramMap.pipe(
      switchMap(params => {
        const projectId = params.get('id');
        if (projectId) {
          return this.projectDataService.getProjectById(projectId);
        }
        return of(undefined);
      }),
      tap(project => {
        this.currentProject = project;
        if (!project) {
          this.router.navigate(['/project-list']);
        }
      }),
      takeUntil(this.destroy$)
    );
  }

  editProject(): void {
    if (this.currentProject) {
      this.router.navigate(['/project-edit', this.currentProject.id]);
    }
  }

  confirmDelete(): void {
    if (!this.currentProject) {
      return;
    }
    this.dialogMessage = `Are you sure you want to delete project "${this.currentProject.title}"? This action cannot be undone.`;
    this.dialogAction = 'delete';
    this.showConfirmationDialog = true;
  }

  onConfirmation(confirmed: boolean): void {
    this.showConfirmationDialog = false;
    if (confirmed && this.dialogAction === 'delete' && this.currentProject) {
      this.projectDataService.deleteProject(this.currentProject.id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          console.log(`Project with ID ${this.currentProject?.id} deleted successfully.`);
          this.router.navigate(['/project-list']);
        },
        error: (err) => {
          console.error('Failed to delete project.', err);
        }
      });
    }
  }

  printSummary(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/project-dashboard']);
  }

  openCarousel(index: number): void {
    this.currentImageIndex = index;
    this.showCarousel = true;
  }

  closeCarousel(): void {
    this.showCarousel = false;
  }

  prevImage(): void {
    if (this.currentProject && this.currentProject.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.currentProject.images.length) % this.currentProject.images.length;
    }
  }

  nextImage(): void {
    if (this.currentProject && this.currentProject.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.currentProject.images.length;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
