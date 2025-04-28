import {Component, OnInit} from '@angular/core';
import {EventService} from '../../../services/event.service';
import {EventManagementComponent} from '../../event-management/event-management.component';

@Component({
  selector: 'app-plpp',
  imports: [
    EventManagementComponent
  ],
  templateUrl: './plpp.component.html',
  styleUrl: './plpp.component.css'
})
export class PlppComponent implements OnInit {

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.setFilterDivision('PLPP');
  }

}
