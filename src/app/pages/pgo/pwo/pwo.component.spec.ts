import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwoComponent } from './pwo.component';

describe('PwoComponent', () => {
  let component: PwoComponent;
  let fixture: ComponentFixture<PwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
