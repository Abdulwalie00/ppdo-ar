import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Division, Event} from '../../../models/event.model';

@Component({
  selector: 'app-event-form-dialog',
  imports: [
    FormsModule
  ],
  template: `
    <div class="space-y-4">
      <button
        (click)="cancel.emit()"
        class="flex items-center text-blue-500 hover:text-blue-700 mb-4"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back to list
      </button>

      <h3 class="text-xl font-bold">{{ isEditMode ? 'Edit Event' : 'Add New Event' }}</h3>

      <form (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Title*</label>
            <input
              type="text"
              [(ngModel)]="eventData.title"
              name="title"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Division*</label>
            <select
              [(ngModel)]="eventData.division"
              name="division"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option *ngFor="let division of divisions" [value]="division">
                {{ division }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Description*</label>
          <textarea
            [(ngModel)]="eventData.description"
            name="description"
            required
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Status and Location -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Status*</label>
            <select
              [(ngModel)]="eventData.status"
              name="status"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option *ngFor="let status of statusOptions" [value]="status">
                {{ status }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Location*</label>
            <input
              type="text"
              [(ngModel)]="eventData.location"
              name="location"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
        </div>

        <!-- Completion Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Completion Date</label>
          <input
            type="date"
            [(ngModel)]="eventData.dateCompletion"
            name="dateCompletion"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
          <p class="mt-1 text-sm text-gray-500">Required for Completed events</p>
        </div>

        <!-- Budget -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Budget</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              [(ngModel)]="eventData.budget"
              name="budget"
              min="0"
              step="0.01"
              class="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
        </div>

        <!-- Fund Source and Images -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Fund Source*</label>
          <input
            type="text"
            [(ngModel)]="eventData.fundSource"
            name="fundSource"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Image URLs (comma separated)
          </label>
          <textarea
            [(ngModel)]="eventData.images"
            name="images"
            rows="2"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          ></textarea>
          <p class="mt-1 text-sm text-gray-500">Leave blank if no images available</p>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-2 pt-4 border-t">
          <button
            type="button"
            (click)="cancel.emit()"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {{ isEditMode ? 'Update Event' : 'Save Event' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class EventFormComponent {
  @Input() isEditMode = false;

  @Input() eventData: Omit<Event, 'id' | 'images' | 'dateCompletion'> & {
    images: string;
    dateCompletion?: string;
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

  @Input() divisions: Division[] = [];
  @Input() statusOptions: Event['status'][] = ['Planned', 'Ongoing', 'Completed', 'Cancelled'];

  @Output() submitEvent = new EventEmitter<{
    eventData: Omit<Event, 'id'>;
    isEditMode: boolean;
  }>();
  @Output() cancel = new EventEmitter<void>();

  onSubmit() {
    const images = this.eventData.images ?
      this.eventData.images.split(',').map(url => url.trim()).filter(url => url) : [];

    const eventToEmit = {
      ...this.eventData,
      images,
      dateCompletion: this.eventData.dateCompletion ? new Date(this.eventData.dateCompletion) : undefined
    };

    this.submitEvent.emit({
      eventData: eventToEmit,
      isEditMode: this.isEditMode
    });
  }


}
