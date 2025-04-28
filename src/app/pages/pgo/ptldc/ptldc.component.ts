import {Component, OnInit} from '@angular/core';
import {EventService} from '../../../services/event.service';
import {EventManagementComponent} from '../../event-management/event-management.component';

@Component({
  selector: 'app-ptldc',
  imports: [
    EventManagementComponent
  ],
  templateUrl: './ptldc.component.html',
  styleUrl: './ptldc.component.css'
})
export class PtldcComponent implements OnInit {

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.setFilterDivision('PTLDC');
  }

}
