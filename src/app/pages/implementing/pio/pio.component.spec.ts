import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PioComponent } from './pio.component';

describe('PioComponent', () => {
  let component: PioComponent;
  let fixture: ComponentFixture<PioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
