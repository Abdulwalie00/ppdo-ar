import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtldcComponent } from './ptldc.component';

describe('PtldcComponent', () => {
  let component: PtldcComponent;
  let fixture: ComponentFixture<PtldcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PtldcComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtldcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
