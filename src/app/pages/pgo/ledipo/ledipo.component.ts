import {Component, OnInit} from '@angular/core';
import {EventService} from '../../../services/event.service';
import {EventManagementComponent} from '../../event-management/event-management.component';

@Component({
  selector: 'app-ledipo',
  imports: [
    EventManagementComponent
  ],
  templateUrl: './ledipo.component.html',
  styleUrl: './ledipo.component.css'
})
export class LedipoComponent implements OnInit {

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.setFilterDivision('LEDIPO');
  }

}
