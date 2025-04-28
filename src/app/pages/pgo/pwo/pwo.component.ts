import {Component, OnInit} from '@angular/core';
import {EventService} from '../../../services/event.service';
import {EventManagementComponent} from '../../event-management/event-management.component';

@Component({
  selector: 'app-pwo',
  imports: [
    EventManagementComponent
  ],
  templateUrl: './pwo.component.html',
  styleUrl: './pwo.component.css'
})
export class PwoComponent implements OnInit {

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.setFilterDivision('PWO');
  }

}
