import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedipoComponent } from './ledipo.component';

describe('LedipoComponent', () => {
  let component: LedipoComponent;
  let fixture: ComponentFixture<LedipoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LedipoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LedipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
