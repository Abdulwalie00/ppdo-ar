import {Component, OnInit} from '@angular/core';
import {EventService} from '../../../services/event.service';
import {EventManagementComponent} from '../../event-management/event-management.component';

@Component({
  selector: 'app-rydo',
  imports: [
    EventManagementComponent
  ],
  templateUrl: './rydo.component.html',
  styleUrl: './rydo.component.css'
})
export class RydoComponent implements OnInit {

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.setFilterDivision('RYDO');
  }

}
