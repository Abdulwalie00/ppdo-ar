// src/app/components/project-detail/project-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectConfirmationDialogComponent } from '../project-confirmation-dialog/project-confirmation-dialog.component';
import {ProjectDataService} from '../../../services/project-data.service';
import {Project} from '../../../models/project.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectConfirmationDialogComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent implements OnInit {
  project: Project | undefined;
  projectId: string | null = null;

  // Confirmation dialog
  showConfirmationDialog: boolean = false;
  dialogMessage: string = '';
  dialogAction: 'delete' | '' = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectDataService: ProjectDataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id');
      if (this.projectId) {
        this.projectDataService.getProjectById(this.projectId).subscribe(project => {
          if (project) {
            this.project = project;
          } else {
            // Project not found, navigate back to list
            this.router.navigate(['/project-list']);
          }
        });
      }
    });
  }

  editProject(): void {
    if (this.project) {
      this.router.navigate(['/project-edit', this.project.id]);
    }
  }

  confirmDelete(): void {
    this.dialogMessage = 'Are you sure you want to delete this project? This action cannot be undone.';
    this.dialogAction = 'delete';
    this.showConfirmationDialog = true;
  }

  onConfirmation(confirmed: boolean): void {
    this.showConfirmationDialog = false;
    if (confirmed && this.dialogAction === 'delete' && this.project) {
      this.projectDataService.deleteProject(this.project.id).subscribe(success => {
        if (success) {
          this.router.navigate(['/project-list']);
        } else {
          console.error('Failed to delete project.');
          // Optionally show an error message
        }
      });
    }
  }

  printSummary(): void {
    // This is a basic print functionality. For more complex reports,
    // consider using a library like jsPDF or generating a dedicated print view.
    window.print();
  }
}
