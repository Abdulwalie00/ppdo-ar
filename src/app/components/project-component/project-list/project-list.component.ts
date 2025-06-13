import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import {Project} from '../../../models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent implements OnInit {
  @Input() projects: Project[] | null = [];
  @Input() showAddButton: boolean = true;
  @Input() currentDivisionCode: string | null = null; // New Input

  constructor(private router: Router) {}

  ngOnInit(): void {
    // If not used as an input, you would fetch all projects here:
    // this.projectDataService.getProjects().subscribe(projs => this.projects = projs);
  }

  goToAddProject(): void {
    if (this.currentDivisionCode) {
      this.router.navigate(['/project-add'], { queryParams: { division: this.currentDivisionCode } });
    } else {
      this.router.navigate(['/project-add']);
    }
  }

  viewProjectDetails(projectId: string): void {
    this.router.navigate(['/project-detail', projectId]);
  }
}
