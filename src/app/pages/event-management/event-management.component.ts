import {Component, inject, Input, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {Division, Event} from '../../models/event.model';
import {EventService} from '../../services/event.service';
import {ImageDialogComponent} from '../../components/shared/image-dialog/image-dialog.component';
import {EventFormComponent} from '../../components/shared/event-form-dialog/event-form-dialog.component';

@Component({
  selector: 'app-event-management',
  standalone: true,
  imports: [CommonModule, FormsModule, EventFormComponent],
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.css']
})
export class EventManagementComponent  {
  private eventService = inject(EventService);
  private dialog = inject(MatDialog);
  isEditMode = false;

  @Input() hideFilter = false;
  @Input() filterDivision?: Division | 'All';

  events = this.eventService.getEvents();
  divisions = this.eventService.getDivisions();
  selectedEvent: Event | null = null;
  showEventForm = false;
  selectedDivision: Division | 'All' = 'All';

  // Form fields
  newEvent: Omit<Event, 'id' | 'images' | 'dateCompletion'> & {
    images: string;
    dateCompletion?: string;  // Changed from Date to string for form input
  } = {
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


  formData = {
    title: '',
    description: '',
    location: '',
    dateCompletion: undefined,
    budget: undefined,
    fundSource: '',
    images: '',
    division: 'PTCAO',
    status: 'Planned' as const
  };

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
    // Reset the form data
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

    this.selectedEvent = null;
    this.showEventForm = true;
    this.isEditMode = false;
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
    this.isEditMode = false;
  }

  editEvent(): void {
    if (!this.selectedEvent) return;

    const images = this.newEvent.images ?
      this.newEvent.images.split(',').map(url => url.trim()).filter(url => url) : [];

    const updatedEvent: Event = {
      ...this.selectedEvent,
      title: this.newEvent.title,
      description: this.newEvent.description,
      location: this.newEvent.location,
      dateCompletion: this.newEvent.dateCompletion ? new Date(this.newEvent.dateCompletion) : undefined,
      budget: this.newEvent.budget,
      fundSource: this.newEvent.fundSource,
      images,
      division: this.newEvent.division,
      status: this.newEvent.status
    };

    this.eventService.editEvent(updatedEvent);
    this.resetForm();
    this.showEventForm = false;
    this.isEditMode = false;
    this.selectedEvent = updatedEvent;
  }

  deleteEvent(event: Event): void {
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      this.eventService.deleteEvent(event.id);
      if (this.selectedEvent && this.selectedEvent.id === event.id) {
        this.selectedEvent = null;
      }
    }
  }

  showEditEventForm(event: Event): void {
    this.selectedEvent = event;
    this.isEditMode = true;
    this.showEventForm = true;

    // Populate form with event data
    this.newEvent = {
      title: event.title,
      description: event.description,
      location: event.location,
      dateCompletion: event.dateCompletion ? event.dateCompletion.toISOString().split('T')[0] : undefined,
      budget: event.budget,
      fundSource: event.fundSource,
      images: event.images.join(', '),
      division: event.division,
      status: event.status
    };
  }

  handleFormSubmit(event: { eventData: Omit<Event, 'id'>; isEditMode: boolean }) {
    if (event.isEditMode && this.selectedEvent) {
      const updatedEvent: Event = {
        ...this.selectedEvent,
        ...event.eventData
      };
      this.eventService.editEvent(updatedEvent);
      this.selectedEvent = updatedEvent;
    } else {
      this.eventService.addEvent(event.eventData);
    }
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
    this.isEditMode = false;
  }

  filterByDivision(division: Division | 'All'): void {
    this.selectedDivision = division;
    this.eventService.setFilterDivision(division);
  }


}
