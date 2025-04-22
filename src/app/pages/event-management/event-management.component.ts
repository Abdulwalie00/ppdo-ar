import {Component, inject, Input, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {Division, Event} from '../../models/event.model';
import {EventService} from '../../services/event.service';
import {ImageDialogComponent} from '../../components/shared/image-dialog/image-dialog.component';

@Component({
  selector: 'app-event-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent  {
  private eventService = inject(EventService);
  private dialog = inject(MatDialog);

  @Input() hideFilter = false;
  @Input() filterDivision?: Division | 'All';

  events = this.eventService.getEvents();
  divisions = this.eventService.getDivisions();
  selectedEvent: Event | null = null;
  showEventForm = false;
  selectedDivision: Division | 'All' = 'All';

  // Form fields
  newEvent: Omit<Event, 'id' | 'images'> & { images: string } = {
    title: '',
    description: '',
    location: '',
    dateCompletion: undefined,
    budget: undefined,
    fundSource: '',
    images: '',
    division: 'PTCAO',
    status: 'Planned'
  };

  statusOptions: Event['status'][] = ['Planned', 'Ongoing', 'Completed', 'Cancelled'];

  constructor() {
    this.eventService.filterDivision$.subscribe(() => {
      this.events = this.eventService.getEvents();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterDivision']) {
      this.eventService.setFilterDivision(this.filterDivision || 'All');
    }
  }

  selectEvent(event: Event): void {
    this.selectedEvent = event;
    this.showEventForm = false;
  }

  showAddEventForm(): void {
    this.selectedEvent = null;
    this.showEventForm = true;
  }

  addEvent(): void {
    const images = this.newEvent.images ?
      this.newEvent.images.split(',').map(url => url.trim()).filter(url => url) : [];

    const eventToAdd = {
      ...this.newEvent,
      images,
      dateCompletion: this.newEvent.dateCompletion ? new Date(this.newEvent.dateCompletion) : undefined
    };

    this.eventService.addEvent(eventToAdd);
    this.resetForm();
    this.showEventForm = false;
  }

  resetForm(): void {
    this.newEvent = {
      title: '',
      description: '',
      location: '',
      dateCompletion: undefined,
      budget: undefined,
      fundSource: '',
      images: '',
      division: 'PTCAO',
      status: 'Planned'
    };
  }

  openImageDialog(imageUrl: string): void {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl }
    });
  }

  backToList(): void {
    this.selectedEvent = null;
    this.showEventForm = false;
  }

  filterByDivision(division: Division | 'All'): void {
    this.selectedDivision = division;
    this.eventService.setFilterDivision(division);
  }
}
