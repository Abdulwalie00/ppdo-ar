import {Component, OnInit} from '@angular/core';
import {EventService} from '../../../services/event.service';
import {EventManagementComponent} from '../../event-management/event-management.component';

@Component({
  selector: 'app-pdd',
  imports: [
    EventManagementComponent
  ],
  templateUrl: './pdd.component.html',
  styleUrl: './pdd.component.css'
})
export class PddComponent implements OnInit {

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.setFilterDivision('PDD');
  }

}
