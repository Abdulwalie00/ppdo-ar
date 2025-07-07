import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { ProjectConfirmationDialogComponent } from '../project-confirmation-dialog/project-confirmation-dialog.component';
import { map } from 'rxjs/operators';
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
  selectedImages: { file: File, url: string }[] = [];
  currentProjectImages: ProjectImage[] = [];

  showConfirmationDialog: boolean = false;
  dialogMessage: string = '';
  dialogAction: 'add' | 'update' = 'add';

  preselectedDivisionId: string | null = null;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectDataService: ProjectDataService
  ) {}

  ngOnInit(): void {
    this.loadDivisions();
    this.initForm();

    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id');
      this.isEditMode = !!this.projectId;

      if (this.isEditMode && this.projectId) {
        this.loadProjectForEdit(this.projectId);
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

  loadProjectForEdit(id: string): void {
    this.projectDataService.getProjectById(id).subscribe(project => {
      if (project) {
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
        this.currentProjectImages = project.images || [];
      }
    });
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
        reader.readAsDataURL(file);
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

      // Convert newly selected files into ProjectImage objects
      const newImages: ProjectImage[] = this.selectedImages.map(img => ({
        id: uuidv4(),
        projectId: this.projectId || '',
        imageUrl: img.url, // This is the Data URL
        caption: '',
        dateUploaded: new Date(),
      }));

      // In edit mode, combine existing images with new ones. Otherwise, just use new ones.
      const finalImages = this.isEditMode
        ? [...this.currentProjectImages, ...newImages]
        : newImages;

      // Create the DTO for the backend
      const projectData = {
        title: formValue.title,
        description: formValue.description,
        location: formValue.location,
        startDate: new Date(formValue.startDate),
        endDate: new Date(formValue.endDate),
        budget: formValue.budget,
        fundSource: formValue.fundSource,
        status: formValue.status,
        divisionId: formValue.divisionId,
        images: finalImages // Send the array of image objects
      };

      if (this.isEditMode && this.projectId) {
        this.projectDataService.updateProject(this.projectId, projectData).subscribe(() => {
          this.router.navigate(['/project-detail', this.projectId]);
        });
      } else {
        this.projectDataService.addProject(projectData).subscribe(newProject => {
          this.router.navigate(['/project-detail', newProject.id]);
        });
      }
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
