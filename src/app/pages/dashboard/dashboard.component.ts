import { Component, inject, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl:  './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    NgForOf
  ],
  standalone: true
})
export class DashboardComponent implements OnInit {
  private eventService = inject(EventService);
  events: Event[] = [];

  totalEvents = 0;
  completed = 0;
  ongoing = 0;
  planned = 0;
  cancelled = 0;

  ngOnInit(): void {
    this.eventService.setFilterDivision('All'); // reset filter
    this.fetchEventData();
  }

  fetchEventData(): void {
    this.events = this.eventService.getEvents();

    this.totalEvents = this.events.length;
    this.completed = this.events.filter(e => e.status === 'Completed').length;
    this.ongoing = this.events.filter(e => e.status === 'Ongoing').length;
    this.planned = this.events.filter(e => e.status === 'Planned').length;
    this.cancelled = this.events.filter(e => e.status === 'Cancelled').length;
  }
}
