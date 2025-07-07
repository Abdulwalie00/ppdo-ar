// src/app/components/project-add-edit/project-add-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { ProjectConfirmationDialogComponent } from '../project-confirmation-dialog/project-confirmation-dialog.component';
import { Division, Project, ProjectImage } from '../../../models/project.model';
import { ProjectDataService } from '../../../services/project-data.service';

@Component({
  selector: 'app-project-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProjectConfirmationDialogComponent],
  templateUrl: './project-add-edit.component.html',
  styleUrls: ['./project-add-edit.component.css']
})
export class ProjectAddEditComponent implements OnInit {
  projectForm!: FormGroup;
  isEditMode: boolean = false;
  projectId: string | null = null;
  divisions: Division[] = [];

  // Store newly uploaded image URLs
  newlyUploadedImages: ProjectImage[] = [];
  // Store existing images for display
  currentProjectImages: ProjectImage[] = [];

  showConfirmationDialog: boolean = false;
  dialogMessage: string = '';
  dialogAction: 'add' | 'update' = 'add';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectDataService: ProjectDataService
  ) {}

  ngOnInit(): void {
    this.loadDivisions();
    this.initForm();

    this.route.paramMap.pipe(
      switchMap(params => {
        this.projectId = params.get('id');
        this.isEditMode = !!this.projectId;
        if (this.isEditMode && this.projectId) {
          return this.projectDataService.getProjectById(this.projectId);
        }
        return of(null);
      })
    ).subscribe(project => {
      if (project) {
        this.loadProjectForEdit(project);
      }
    });
  }

  initForm(): void {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      budget: ['', [Validators.required, Validators.min(0)]],
      fundSource: ['', Validators.required],
      divisionId: ['', Validators.required],
      status: ['planned', Validators.required]
    });
  }

  loadDivisions(): void {
    this.projectDataService.getDivisions().subscribe(divisions => {
      this.divisions = divisions;
    });
  }

  loadProjectForEdit(project: Project): void {
    this.projectForm.patchValue({
      title: project.title,
      description: project.description,
      location: project.location,
      startDate: new Date(project.startDate).toISOString().substring(0, 10),
      endDate: new Date(project.endDate).toISOString().substring(0, 10),
      budget: project.budget,
      fundSource: project.fundSource,
      divisionId: project.division.id,
      status: project.status
    });
    // Keep track of existing images
    this.currentProjectImages = project.images || [];
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const files = Array.from(input.files);
    // Create an array of upload observables
    const uploadObservables = files.map(file =>
      this.projectDataService.uploadImage(file)
    );

    // Execute all uploads in parallel
    forkJoin(uploadObservables).subscribe({
      next: (urls) => {
        // Once all uploads are complete, create ProjectImage objects
        const newImages = urls.map(url => ({
          id: uuidv4(), // Generate a temporary client-side ID
          projectId: this.projectId || '',
          imageUrl: url, // The URL from the server
          caption: '',
          dateUploaded: new Date()
        }));
        // Add the newly uploaded images to our list
        this.newlyUploadedImages.push(...newImages);
      },
      error: (err) => {
        console.error('Image upload failed', err);
        // You can add user-facing error handling here
      }
    });
  }

  // Remove an image that was just uploaded in this session
  removeNewImage(imageUrl: string): void {
    this.newlyUploadedImages = this.newlyUploadedImages.filter(img => img.imageUrl !== imageUrl);
  }

  // Mark an existing image for removal
  removeCurrentImage(imageId: string): void {
    this.currentProjectImages = this.currentProjectImages.filter(img => img.id !== imageId);
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }
    this.dialogAction = this.isEditMode ? 'update' : 'add';
    this.dialogMessage = `Are you sure you want to ${this.dialogAction} this project?`;
    this.showConfirmationDialog = true;
  }

  onConfirmation(confirmed: boolean): void {
    this.showConfirmationDialog = false;
    if (confirmed) {
      const formValue = this.projectForm.getRawValue();

      // Combine the remaining existing images with the newly uploaded ones
      const finalImages = [...this.currentProjectImages, ...this.newlyUploadedImages];

      const projectData = {
        ...formValue,
        images: finalImages
      };

      const operation = this.isEditMode && this.projectId
        ? this.projectDataService.updateProject(this.projectId, projectData)
        : this.projectDataService.addProject(projectData);

      operation.subscribe(project => {
        this.router.navigate(['/project-detail', project.id]);
      });
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.projectId) {
      this.router.navigate(['/project-detail', this.projectId]);
    } else {
      this.router.navigate(['/project-dashboard']);
    }
  }
}
