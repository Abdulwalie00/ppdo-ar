import {Component, OnInit} from '@angular/core';
import {EventManagementComponent} from "../../event-management/event-management.component";
import {EventService} from '../../../services/event.service';

@Component({
  selector: 'app-gad',
    imports: [
        EventManagementComponent
    ],
  templateUrl: './gad.component.html',
  styleUrl: './gad.component.css'
})
export class GadComponent implements OnInit {

  constructor(private eventService: EventService) {
  }

  ngOnInit() {
    this.eventService.setFilterDivision('GAD');
  }

}
