import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUsers,
  faFileAlt,
  faChartLine,
  faDatabase
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  faUsers = faUsers;
  faFileAlt = faFileAlt;
  faChartLine = faChartLine;
  faDatabase = faDatabase;

  stats = [
    { title: 'Total Users', value: '1,234', icon: this.faUsers, color: 'bg-blue-500' },
    { title: 'Documents', value: '4,567', icon: this.faFileAlt, color: 'bg-green-500' },
    { title: 'Transactions', value: '8,901', icon: this.faChartLine, color: 'bg-yellow-500' },
    { title: 'Data Records', value: '12,345', icon: this.faDatabase, color: 'bg-red-500' }
  ];
}
