import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe, Location } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { ProjectConfirmationDialogComponent } from '../project-confirmation-dialog/project-confirmation-dialog.component';
import { ProjectDataService } from '../../../services/project-data.service';
import { Project, Comment } from '../../../models/project.model'; // Import Comment
import { Observable, Subject, of } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service'; // Assuming you have an AuthService

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProjectConfirmationDialogComponent, DatePipe], // Add FormsModule
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project$: Observable<Project | undefined>;
  currentProject: Project | undefined;
  comments: Comment[] = [];
  newComment = '';
  currentUserRole = '';

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
    private location: Location,
    private authService: AuthService // Inject AuthService
  ) {
    this.project$ = of(undefined);
  }

  ngOnInit(): void {
    this.currentUserRole = this.authService.getUserRole(); // Get user role

    this.project$ = this.route.paramMap.pipe(
      switchMap(params => {
        const projectId = params.get('id');
        if (projectId) {
          this.loadComments(projectId);
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

  loadComments(projectId: string): void {
    this.projectDataService.getComments(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(comments => {
        this.comments = comments.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
      });
  }

  postComment(): void {
    if (!this.newComment.trim() || !this.currentProject) {
      return;
    }
    this.projectDataService.addComment(this.currentProject.id, this.newComment)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.newComment = '';
        if (this.currentProject) {
          this.loadComments(this.currentProject.id); // Reload comments
        }
      });
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
          this.router.navigate(['/project-list']);
        },
        error: (err) => {
          console.error('Failed to delete project.', err);
        }
      });
    }
  }

  goBack(): void {
    this.location.back();
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
