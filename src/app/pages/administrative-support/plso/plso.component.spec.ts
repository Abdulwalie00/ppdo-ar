import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlsoComponent } from './plso.component';

describe('PlsoComponent', () => {
  let component: PlsoComponent;
  let fixture: ComponentFixture<PlsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlsoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
