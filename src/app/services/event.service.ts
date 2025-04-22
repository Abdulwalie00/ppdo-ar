import { Injectable } from '@angular/core';
import { Event, Division } from '../models/event.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: Event[] = [
    {
      id: 1,
      title: 'Annual Planning Conference',
      description: 'Department-wide planning for fiscal year 2024',
      location: 'Grand Ballroom, City Hotel',
      dateCompletion: new Date('2024-01-16'),
      budget: 145000,
      fundSource: 'General Funds',
      images: ['https://picsum.photos/600/400?random=1', 'https://picsum.photos/600/400?random=2'],
      division: 'PTCAO',
      status: 'Completed'
    },
    {
      id: 2,
      title: 'IT Infrastructure Upgrade',
      description: 'Upgrade of all department computers and servers',
      location: 'Main Office Building',
      dateCompletion: new Date('2024-02-15'),
      budget: 520000,
      fundSource: 'Capital Outlay',
      images: ['https://picsum.photos/600/400?random=3'],
      division: 'ICTO',
      status: 'Completed'
    },
    {
      id: 3,
      title: 'Gender Sensitivity Training',
      description: 'Mandatory training for all employees',
      location: 'Training Room 3',
      dateCompletion: new Date('2024-03-05'),
      budget: 70000,
      fundSource: 'GAD Funds',
      images: ['https://picsum.photos/600/400?random=4'],
      division: 'GAD',
      status: 'Completed'
    },
    {
      id: 4,
      title: 'Local Economic Development Forum',
      description: 'Forum with local businesses and stakeholders',
      location: 'Convention Center',
      budget: 200000,
      fundSource: 'Special Projects',
      images: [],
      division: 'LEDIPO',
      status: 'Ongoing'
    },
    {
      id: 5,
      title: 'Public Works Bidding',
      description: 'Public bidding for road construction project',
      location: 'Procurement Office',
      budget: 10000,
      fundSource: 'Project Funds',
      images: [],
      division: 'PWO',
      status: 'Planned'
    },
    {
      id: 6,
      title: 'Budget Hearing',
      description: 'Department budget presentation to council',
      location: 'Council Chambers',
      budget: 5000,
      fundSource: 'Operating Budget',
      images: [],
      division: 'BUDGET',
      status: 'Planned'
    },
    {
      id: 7,
      title: 'HR Onboarding Session',
      description: 'Orientation for new employees',
      location: 'HR Training Room',
      dateCompletion: new Date('2024-02-28'),
      budget: 23000,
      fundSource: 'HR Development',
      images: ['https://picsum.photos/600/400?random=5'],
      division: 'HR',
      status: 'Completed'
    },
    {
      id: 8,
      title: 'Project Development Workshop',
      description: 'Training on project proposal writing',
      location: 'Regional Office',
      dateCompletion: new Date('2024-03-17'),
      budget: 115000,
      fundSource: 'Capacity Building',
      images: ['https://picsum.photos/600/400?random=6'],
      division: 'PDD',
      status: 'Completed'
    },
    {
      id: 9,
      title: 'Public Library Book Drive',
      description: 'Community book donation event',
      location: 'City Public Library',
      budget: 30000,
      fundSource: 'Special Projects',
      images: ['https://picsum.photos/600/400?random=7'],
      division: 'PLPP',
      status: 'Ongoing'
    },
    {
      id: 10,
      title: 'Municipal Assessment',
      description: 'Annual assessment of municipal operations',
      location: 'Various Barangays',
      budget: 80000,
      fundSource: 'General Funds',
      images: [],
      division: 'MAO',
      status: 'Planned'
    }
  ];

  private selectedEventSubject = new BehaviorSubject<Event | null>(null);
  selectedEvent$ = this.selectedEventSubject.asObservable();

  private filterDivisionSubject = new BehaviorSubject<Division | 'All'>('All');
  filterDivision$ = this.filterDivisionSubject.asObservable();

  constructor() {}

  getEvents(): Event[] {
    const divisionFilter = this.filterDivisionSubject.value;
    if (divisionFilter === 'All') {
      return this.events;
    }
    return this.events.filter(event => event.division === divisionFilter);
  }

  getDivisions(): Division[] {
    return ['PTCAO', 'ICTO', 'PDD', 'PLPP', 'GAD', 'LEDIPO', 'PWO', 'MAO', 'BUDGET', 'HR'];
  }

  setFilterDivision(division: Division | 'All'): void {
    this.filterDivisionSubject.next(division);
  }

  selectEvent(event: Event): void {
    this.selectedEventSubject.next(event);
  }

  addEvent(newEvent: Omit<Event, 'id'>): void {
    const id = this.events.length > 0 ? Math.max(...this.events.map(e => e.id)) + 1 : 1;
    this.events.push({ id, ...newEvent });
  }
}
