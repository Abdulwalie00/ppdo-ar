// src/app/components/project-add-edit/project-add-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

import { ProjectConfirmationDialogComponent } from '../project-confirmation-dialog/project-confirmation-dialog.component';
import {Division, Project, ProjectCategory, ProjectImage} from '../../../models/project.model';
import { AuthService } from '../../../services/auth.service';
import { ProjectDataService } from '../../../services/project-data.service';
import {UserService} from '../../../services/user.service';
// Import the dialog component
import {ProjectCategoryAddDialogComponent} from "../project-category-add-dialog/project-category-add-dialog.component";

// Custom validator for the date range
export function dateRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const startDate = control.get('startDate')?.value;
  const endDate = control.get('endDate')?.value;
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return { 'dateRange': true };
  }
  return null;
}

@Component({
  selector: 'app-project-add-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProjectConfirmationDialogComponent,
    ProjectCategoryAddDialogComponent // Import the dialog
  ],
  templateUrl: './project-add-edit.component.html',
  styleUrls: ['./project-add-edit.component.css']
})
export class ProjectAddEditComponent implements OnInit {
  projectForm!: FormGroup;
  isEditMode: boolean = false;
  showMoreFields: boolean = false;
  projectId: string | null = null;
  divisions: Division[] = [];
  projectCategories: ProjectCategory[] = [];
  public isAdmin: boolean = false;

  newlyUploadedImages: ProjectImage[] = [];
  currentProjectImages: ProjectImage[] = [];

  showConfirmationDialog: boolean = false;
  dialogMessage: string = '';
  dialogAction: 'add' | 'update' = 'add';

  // Dialog control
  showAddCategoryDialog = false;

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

        if (this.isEditMode && this.projectId) {
          // EDIT MODE
          return this.projectDataService.getProjectById(this.projectId);
        } else {
          // ADD MODE
          return of(null); // Continue the stream for add mode
        }
      })
    ).subscribe(project => {
      if (this.isEditMode && project) {
        // EDIT MODE: We have the project data
        this.loadProjectForEdit(project);
        // Set division for display and disable the field for all users.
        this.divisions = [project.division];
        this.projectForm.get('divisionId')?.disable();
      } else {
        // ADD MODE: No project data, set up for a new project.
        // The division field will be fixed to the current user's division.
        this.userService.getCurrentUserDivision().subscribe(userDivision => {
          if (userDivision) {
            this.projectForm.patchValue({ divisionId: userDivision.id });
            this.loadProjectCategories(userDivision.id);
            this.divisions = [userDivision];
            // Disable the division field for all users in add mode.
            this.projectForm.get('divisionId')?.disable();
          }
        });
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
      projectCategoryId: [''],
      status: ['planned', Validators.required],
      remarks: ['', Validators.required],
      officeInCharge: ['', Validators.required],
      percentCompletion: [0],
      implementationSchedule: [''],
      dateOfAccomplishment: [''],
    }, { validators: dateRangeValidator });
  }

  loadDivisions(): void {
    // This is now only called in edit mode if needed, but the field is disabled.
    // Keeping it for potential future use.
    this.projectDataService.getDivisions().subscribe(divisions => {
      this.divisions = divisions;
    });
  }

  loadProjectCategories(divisionId: string): void {
    this.projectDataService.getProjectCategories(divisionId).subscribe(categories => {
      this.projectCategories = categories;
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
      implementationSchedule: project.implementationSchedule,
      dateOfAccomplishment: project.dateOfAccomplishment,
      targetParticipant: project.targetParticipant,
      fundSource: project.fundSource,
      divisionId: project.division.id,
      projectCategoryId: project.projectCategory?.id,
      status: project.status,
      // ✨ FIX: Add these two lines
      remarks: project.remarks,
      officeInCharge: project.officeInCharge
    });
    this.loadProjectCategories(project.division.id);
    this.currentProjectImages = project.images || [];
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement.value === 'add-new-category') {
      this.showAddCategoryDialog = true;
      // Reset the dropdown to its previous value or to the placeholder
      this.projectForm.get('projectCategoryId')?.setValue('', { emitEvent: false });
    }
  }

  handleCategorySaved(newCategory: ProjectCategory): void {
    // Add new category to the list
    this.projectCategories.push(newCategory);
    // Set the form value to the newly added category
    this.projectForm.get('projectCategoryId')?.setValue(newCategory.id);
    // Close the dialog
    this.showAddCategoryDialog = false;
  }

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
      error: (err) => console.error('Image upload failed', err)
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
      // Use getRawValue() to include the disabled divisionId field
      const formValue = this.projectForm.getRawValue();
      const finalImages = [...this.currentProjectImages, ...this.newlyUploadedImages];
      const projectData = { ...formValue, images: finalImages };

      // You can log the data to the console to check it before sending
      console.log('Project Data:', projectData);

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
