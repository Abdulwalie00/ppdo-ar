import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {Division, Project} from '../../../models/project.model';
import {ProjectDataService} from '../../../services/project-data.service';
import {DivisionService} from '../../../services/division.service';
import {AuthService} from '../../../services/auth.service';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-project-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './project-summary.component.html',
})
export class ProjectSummaryComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  paginatedProjects: Project[] = [];
  divisions: Division[] = [];

  // Filter properties
  selectedDivision: string = '';
  selectedMonth: string = '';
  selectedYear: string = '';

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [10, 20, 50, 100];
  totalPages: number = 0;

  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years: number[] = [];
  isAdmin: boolean = false;
  userDivisionName: string = ''; // To store division name for print header
  private authSubscription: Subscription | undefined;

  constructor(
    private projectDataService: ProjectDataService,
    private divisionService: DivisionService,
    public authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

    if (this.isAdmin) {
      this.loadDivisions();
      this.loadProjectsForAdmin();
    } else {
      const username = this.authService.getUsername();
      if (username) {
        this.userService.getUserByUsername(username).subscribe(user => {
          if (user?.division) {
            this.userDivisionName = user.division.name; // Store division name
            this.loadProjectsForDivision(user.division.id);
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  loadProjectsForAdmin(): void {
    this.projectDataService.getProjects().subscribe(allProjects => {
      this.projects = allProjects;
      this.filterProjects();
      this.populateYears();
    });
  }

  loadProjectsForDivision(divisionId: string | undefined): void {
    if (!divisionId) {
      this.projects = [];
      this.filterProjects();
      return;
    }
    this.projectDataService.getProjects().subscribe(allProjects => {
      this.projects = allProjects.filter(p => p.division.id === divisionId);
      this.filterProjects();
      this.populateYears();
    });
  }

  loadDivisions(): void {
    this.divisionService.getDivisions().subscribe(data => {
      this.divisions = data;
    });
  }

  populateYears(): void {
    if (this.projects.length > 0) {
      const projectYears = this.projects.map(p => new Date(p.startDate).getFullYear());
      this.years = [...new Set(projectYears)].sort();
    } else {
      this.years = [];
    }
  }

  filterProjects(): void {
    let tempProjects = this.projects;

    if (this.selectedYear) {
      tempProjects = tempProjects.filter(p => new Date(p.startDate).getFullYear() === parseInt(this.selectedYear, 10));
    }

    if (this.isAdmin && this.selectedDivision) {
      tempProjects = tempProjects.filter(p => p.division.id === this.selectedDivision);
    }

    if (this.selectedMonth) {
      const monthIndex = this.months.indexOf(this.selectedMonth);
      tempProjects = tempProjects.filter(p => new Date(p.startDate).getMonth() === monthIndex);
    }

    this.filteredProjects = tempProjects;
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProjects.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedProjects = this.filteredProjects.slice(startIndex, endIndex);
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  printReport(): void {
    const year = this.selectedYear || 'All';
    const month = this.selectedMonth || 'All';
    let divisionName = 'All Divisions';

    if (this.isAdmin) {
      if (this.selectedDivision) {
        const division = this.divisions.find(d => d.id === this.selectedDivision);
        divisionName = division ? division.name : 'All Divisions';
      }
    } else {
      divisionName = this.userDivisionName || 'N/A';
    }

    const projectsByCategory: { [key: string]: Project[] } = {};

    this.filteredProjects.forEach(project => {
      const categoryName = project.projectCategory?.name || 'Uncategorized';
      if (!projectsByCategory[categoryName]) {
        projectsByCategory[categoryName] = [];
      }
      projectsByCategory[categoryName].push(project);
    });

    let projectRows = '';
    for (const categoryName in projectsByCategory) {
      if (projectsByCategory.hasOwnProperty(categoryName)) {
        projectRows += `
          <tr class="category-row">
            <td colspan="12"><strong>${categoryName}</strong> </td>
          </tr>
        `;
        projectsByCategory[categoryName].forEach(project => {
          const startDate = new Date(project.startDate).toLocaleDateString();
          const endDate = new Date(project.endDate).toLocaleDateString();

          projectRows += `
                <tr class="main-row">
                  <td>${project.title}</td>
                  <td>${project.location}</td>
                  <td>${project.targetParticipant}</td>
                  <td>${project.implementationSchedule}</td>
                  <td>${startDate}</td>
                  <td>${project.dateOfAccomplishment}</td>
                  <td>${project.officeInCharge}</td>
                  <td>${project.budget}</td>
                  <td>${project.fundSource}</td>
                  <td>${project.percentCompletion}</td>
                  <td>${project.budget}</td>
                  <td>${project.remarks}</td>
                </tr>
            `;
        });
      }
    }

    if (this.filteredProjects.length === 0) {
      projectRows = '<tr><td colspan="12" style="text-align: center;">No data available for the selected filters.</td></tr>';
    }

    const printHtml = `
      <html>
      <head>
        <title>Project Summary Report</title>
        <style>
          @media print {
            @page { size: landscape; }
            body { font-family: Arial, sans-serif; font-size: 10pt; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 6px; text-align: left; }
            th { background-color: #e0e0e0; font-weight: bold; }
            h1, h2 { text-align: center; margin: 0; }
            h1 { font-size: 8pt; }
            h2 { font-size: 14pt; margin-bottom: 10px; }
            .filter-info { margin-bottom: 20px; padding: 10px; border: 1px solid #000; text-align: center; }
            .filter-info p { margin: 4px 0; }
            .main-row { border-top: 2px solid #000; }
            tbody tr:first-child.main-row { border-top: none; }
            .category-row td { background-color: #f8f8f8; font-style: italic; padding-left: 20px; border-bottom: 2px solid #000; }
          }
        </style>
      </head>
      <body>
        <h2>Project Summary Report</h2>
        <div class="filter-info">
          <h2>Applied Filters</h2>
          <p><strong>Year:</strong> ${year}</p>
          <p><strong>Month:</strong> ${month}</p>
          <p><strong>Division:</strong> ${divisionName}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Target Participants</th>
              <th>Implementation Schedule</th>
              <th>Start Date</th>
              <th>Date Accomplished</th>
              <th>Person/s and or Office in Charge</th>
              <th>Target Budget (Php)</th>
              <th>Source of Fund</th>
              <th>% of Completion</th>
              <th>Total Cost Incurred to Date</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${projectRows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printHtml);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500); // Timeout to ensure content loads
    }
  }
}
