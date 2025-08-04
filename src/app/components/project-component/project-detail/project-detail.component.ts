

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectConfirmationDialogComponent } from '../project-confirmation-dialog/project-confirmation-dialog.component';
import { ProjectDataService } from '../../../services/project-data.service';
import { Project, Comment } from '../../../models/project.model';
import { Observable, Subject, of } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import {WebsocketService} from '../../../services/websocker.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProjectConfirmationDialogComponent],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project$: Observable<Project | undefined>;
  currentProject: Project | undefined;
  comments: Comment[] = [];
  newComment = '';
  currentUser: User | null = null;

  showConfirmationDialog = false;
  dialogMessage = '';
  dialogAction: 'delete' | '' = '';

  showCarousel = false;
  currentImageIndex = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectDataService: ProjectDataService,
    private location: Location,
    private authService: AuthService,
    private userService: UserService,
    private websocketService: WebsocketService // Corrected service name
  ) {
    this.project$ = of(undefined);
  }

  ngOnInit(): void {
    this.loadCurrentUser();

    this.project$ = this.route.paramMap.pipe(
      switchMap(params => {
        const projectId = params.get('id');
        if (projectId) {
          // Establish WebSocket connection and start listening
          this.websocketService.connect(projectId);
          this.listenForNewComments();
          // Load initial data
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

  /**
   * Subscribes to the WebSocket service to receive new comments in real-time.
   */
  listenForNewComments(): void {
    this.websocketService.comment$
      .pipe(takeUntil(this.destroy$))
      .subscribe(newComment => {
        // Check if the comment is not already in the list to avoid duplicates
        if (newComment && !this.comments.some(c => c.id === newComment.id)) {
          // Add the new comment to the top of the array for immediate visibility
          this.comments.unshift(newComment);
        }
      });
  }

  loadCurrentUser(): void {
    const username = this.authService.getUsername();
    if (username) {
      this.userService.getUserByUsername(username).pipe(takeUntil(this.destroy$)).subscribe(user => {
        this.currentUser = user;
      });
    }
  }

  loadComments(projectId: string): void {
    this.projectDataService.getComments(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(comments => {
        // Sort comments by most recent first
        this.comments = comments.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
      });
  }

  /**
   * Posts the comment. The view will be updated automatically by the WebSocket listener
   * when the server broadcasts the new comment.
   */
  postComment(): void {
    if (!this.newComment.trim() || !this.currentProject) {
      return;
    }

    this.projectDataService.addComment(this.currentProject.id, this.newComment)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Clear the input field after successful submission.
          // The new comment will appear via the WebSocket.
          this.newComment = '';
        },
        error: (err) => {
          console.error('Failed to post comment', err);
          // Optionally, show a user-friendly error message
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // It's crucial to disconnect to prevent memory leaks
    this.websocketService.disconnect();
  }

  // --- Other component methods (edit, delete, navigation, etc.) ---
  editProject(): void {
    if (this.currentProject) {
      this.router.navigate(['/project-edit', this.currentProject.id]);
    }
  }

  confirmDelete(): void {
    if (!this.currentProject) return;
    this.dialogMessage = `Are you sure you want to delete project "${this.currentProject.title}"?`;
    this.dialogAction = 'delete';
    this.showConfirmationDialog = true;
  }

  onConfirmation(confirmed: boolean): void {
    this.showConfirmationDialog = false;
    if (confirmed && this.dialogAction === 'delete' && this.currentProject) {
      this.projectDataService.deleteProject(this.currentProject.id).subscribe(() => {
        this.router.navigate(['/project-list']);
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
}
