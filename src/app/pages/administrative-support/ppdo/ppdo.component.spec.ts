import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpdoComponent } from './ppdo.component';

describe('PpdoComponent', () => {
  let component: PpdoComponent;
  let fixture: ComponentFixture<PpdoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PpdoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PpdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
