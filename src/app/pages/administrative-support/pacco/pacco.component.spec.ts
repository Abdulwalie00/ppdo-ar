import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaccoComponent } from './pacco.component';

describe('PaccoComponent', () => {
  let component: PaccoComponent;
  let fixture: ComponentFixture<PaccoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaccoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaccoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
