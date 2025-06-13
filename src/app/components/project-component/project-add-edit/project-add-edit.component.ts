// src/app/components/project-add-edit/project-add-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { ProjectConfirmationDialogComponent } from '../project-confirmation-dialog/project-confirmation-dialog.component';
import {map} from 'rxjs/operators';
import {Division, Project, ProjectImage} from '../../../models/project.model';
import {ProjectDataService} from '../../../services/project-data.service';

@Component({
  selector: 'app-project-add-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProjectConfirmationDialogComponent],
  templateUrl: './project-add-edit.component.html',
  styleUrl: './project-add-edit.component.css'
})
export class ProjectAddEditComponent implements OnInit {
  projectForm!: FormGroup;
  isEditMode: boolean = false;
  projectId: string | null = null;
  divisions: Division[] = [];
  selectedImages: { file: File, url: string }[] = [];
  currentProjectImages: ProjectImage[] = [];

  // Confirmation dialog
  showConfirmationDialog: boolean = false;
  dialogMessage: string = '';
  dialogAction: 'add' | 'update' | 'delete' | '' = '';

  preselectedDivisionId: string | null = null; // New property to store preselected ID

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectDataService: ProjectDataService
  ) {}

  ngOnInit(): void {
    this.divisions = this.projectDataService.getDivisions();
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.projectId;

    // Check for query parameter for division pre-selection
    this.route.queryParamMap.pipe(
      map(params => params.get('division'))
    ).subscribe(divisionCode => {
      if (!this.isEditMode && divisionCode) { // Only pre-select if not in edit mode
        const division = this.projectDataService.getDivisionByCode(divisionCode);
        if (division) {
          this.preselectedDivisionId = division.id;
        }
      }
      this.initForm(); // Initialize form after potentially getting preselected division
    });


    if (this.isEditMode && this.projectId) {
      this.projectDataService.getProjectById(this.projectId).subscribe(project => {
        if (project) {
          this.projectForm.patchValue({
            id: project.id,
            title: project.title,
            description: project.description,
            location: project.location,
            startDate: project.startDate.toISOString().substring(0, 10),
            endDate: project.endDate.toISOString().substring(0, 10),
            budget: project.budget,
            fundSource: project.fundSource,
            divisionId: project.division.id,
            status: project.status
          });
          this.currentProjectImages = project.images;
        } else {
          this.router.navigate(['/project-list']);
        }
      });
    }
  }

  initForm(): void {
    this.projectForm = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      description: ['', Validators.required],
      location: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      budget: ['', [Validators.required, Validators.min(0)]],
      fundSource: ['', Validators.required],
      divisionId: [this.preselectedDivisionId || '', Validators.required], // Set default value here
      status: ['planned', Validators.required]
    });

    // Disable division dropdown if preselected
    if (this.preselectedDivisionId) {
      this.projectForm.get('divisionId')?.disable();
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedImages.push({ file: file, url: reader.result as string });
        };
        reader.readAsDataURL(file); // Read as Data URL for local display
      }
    }
  }

  removeSelectedImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  removeCurrentProjectImage(imageId: string): void {
    this.currentProjectImages = this.currentProjectImages.filter(img => img.id !== imageId);
  }

  onSubmit(): void {
    // If the divisionId field was disabled, its value won't be included in form.value.
    // So, manually add it back for submission.
    const formValue = this.projectForm.getRawValue(); // Use getRawValue to get values from disabled fields

    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode) {
      this.dialogMessage = 'Are you sure you want to update this project?';
      this.dialogAction = 'update';
    } else {
      this.dialogMessage = 'Are you sure you want to add this project?';
      this.dialogAction = 'add';
    }
    this.showConfirmationDialog = true;
  }

  onConfirmation(confirmed: boolean): void {
    this.showConfirmationDialog = false;
    if (confirmed) {
      const formValue = this.projectForm.getRawValue(); // Use getRawValue here too
      const selectedDivision = this.divisions.find(d => d.id === formValue.divisionId);

      if (!selectedDivision) {
        console.error('Selected division not found.');
        return;
      }

      // Prepare project images from selected local files
      const newImages: ProjectImage[] = this.selectedImages.map(img => ({
        id: uuidv4(),
        projectId: formValue.id || uuidv4(),
        imageUrl: img.url,
        caption: '',
        dateUploaded: new Date()
      }));

      const finalImages = [...this.currentProjectImages, ...newImages];

      const project: Project = {
        id: formValue.id || uuidv4(),
        title: formValue.title,
        description: formValue.description,
        location: formValue.location,
        startDate: new Date(formValue.startDate),
        endDate: new Date(formValue.endDate),
        dateCreated: new Date(),
        dateUpdated: new Date(),
        budget: formValue.budget,
        fundSource: formValue.fundSource,
        division: selectedDivision,
        images: finalImages,
        status: formValue.status
      };

      if (this.isEditMode) {
        this.projectDataService.updateProject(project).subscribe(() => {
          this.router.navigate(['/project-detail', project.id]);
        });
      } else {
        this.projectDataService.addProject(project).subscribe(() => {
          this.router.navigate(['/project-list']);
        });
      }
    }
  }

  onCancel(): void {
    if (this.isEditMode && this.projectId) {
      this.router.navigate(['/project-detail', this.projectId]);
    } else {
      this.router.navigate(['/project-list']);
    }
  }
}
