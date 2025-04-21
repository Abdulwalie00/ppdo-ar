import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcoComponent } from './pco.component';

describe('PcoComponent', () => {
  let component: PcoComponent;
  let fixture: ComponentFixture<PcoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PcoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PcoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
