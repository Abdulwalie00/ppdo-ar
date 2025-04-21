import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenroComponent } from './penro.component';

describe('PenroComponent', () => {
  let component: PenroComponent;
  let fixture: ComponentFixture<PenroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
