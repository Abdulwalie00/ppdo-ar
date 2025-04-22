import {Component, OnInit} from '@angular/core';
import {EventManagementComponent} from '../../event-management/event-management.component';
import {EventService} from '../../../services/event.service';

@Component({
  selector: 'app-ptcao',
  imports: [
    EventManagementComponent
  ],
  templateUrl: './ptcao.component.html',
  styleUrl: './ptcao.component.css'
})
export class PtcaoComponent implements OnInit {

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.setFilterDivision('PTCAO');
  }
}
