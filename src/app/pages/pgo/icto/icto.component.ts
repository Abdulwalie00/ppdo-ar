import {Component, OnInit} from '@angular/core';
import {EventService} from '../../../services/event.service';
import {EventManagementComponent} from '../../event-management/event-management.component';

@Component({
  selector: 'app-icto',
  imports: [
    EventManagementComponent
  ],
  templateUrl: './icto.component.html',
  styleUrl: './icto.component.css'
})
export class IctoComponent implements OnInit {

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.setFilterDivision('ICTO');
  }

}
