// src/app/components/project-add-edit/project-add-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { ProjectConfirmationDialogComponent } from '../project-confirmation-dialog/project-confirmation-dialog.component';
import {Division, Project, ProjectImage} from '../../../models/project.model';
import { AuthService } from '../../../services/auth.service'; // Import AuthService
import { ProjectDataService } from '../../../services/project-data.service';
import {UserService} from '../../../services/user.service';

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
  showMoreFields: boolean = false;
  projectId: string | null = null;
  divisions: Division[] = [];
  public isAdmin: boolean = false;

  newlyUploadedImages: ProjectImage[] = [];
  currentProjectImages: ProjectImage[] = [];

  showConfirmationDialog: boolean = false;
  dialogMessage: string = '';
  dialogAction: 'add' | 'update' = 'add';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectDataService: ProjectDataService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.initForm();

    this.route.paramMap.pipe(
      switchMap(params => {
        this.projectId = params.get('id');
        this.isEditMode = !!this.projectId;

        // Handle ADD mode logic
        if (!this.isEditMode) {
          if (this.isAdmin) {
            this.loadDivisions(); // Admin can select any division
          } else {
            // Non-admin's division is fetched and set automatically
            this.projectForm.get('divisionId')?.disable();
            this.userService.getCurrentUserDivision().subscribe(userDivision => {
              if (userDivision) {
                this.projectForm.patchValue({ divisionId: userDivision.id });
                this.divisions = [userDivision]; // Set divisions array for display
              }
            });
          }
        }

        // Handle EDIT mode logic: fetch project if ID exists
        if (this.isEditMode && this.projectId) {
          return this.projectDataService.getProjectById(this.projectId);
        }
        return of(null);
      })
    ).subscribe(project => {
      if (project) { // This block only runs in EDIT mode
        this.loadDivisions(); // Load all divisions to find the project's division
        this.loadProjectForEdit(project);
        if (!this.isAdmin) {
          // Non-admin cannot change division of an existing project
          this.projectForm.get('divisionId')?.disable();
        }
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
      targetParticipant: ['', Validators.required],
      divisionId: ['', Validators.required],
      status: ['planned', Validators.required],
      percentCompletion: [''],
      implementationSchedule: [''],
      dateOfAccomplishment: [''],
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
      percentCompletion: project.percentCompletion,
      implementaionSchedule: project.implementationSchedule,
      dateOfAccomplishment: project.dateOfAccomplishment,
      targetParticipant: project.targetParticipant,
      fundSource: project.fundSource,
      divisionId: project.division.id,
      status: project.status
    });
    this.currentProjectImages = project.images || [];
  }

  // --- Other methods (onImageSelected, removeNewImage, etc.) remain unchanged ---
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const files = Array.from(input.files);
    const uploadObservables = files.map(file =>
      this.projectDataService.uploadImage(file)
    );

    forkJoin(uploadObservables).subscribe({
      next: (urls) => {
        const newImages = urls.map(url => ({
          id: uuidv4(),
          projectId: this.projectId || '',
          imageUrl: url,
          caption: '',
          dateUploaded: new Date()
        }));
        this.newlyUploadedImages.push(...newImages);
      },
      error: (err) => {
        console.error('Image upload failed', err);
      }
    });
  }

  removeNewImage(imageUrl: string): void {
    this.newlyUploadedImages = this.newlyUploadedImages.filter(img => img.imageUrl !== imageUrl);
  }

  removeCurrentImage(imageId: string): void {
    this.currentProjectImages = this.currentProjectImages.filter(img => img.id !== imageId);
  }

  onPercentInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = Number(input.value);

    if (value > 100) {
      value = 100;
      input.value = '100';
    }

    this.projectForm.get('percentCompletion')?.setValue(value);
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
      // Use getRawValue() to include disabled fields like divisionId for non-admins
      const formValue = this.projectForm.getRawValue();

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
