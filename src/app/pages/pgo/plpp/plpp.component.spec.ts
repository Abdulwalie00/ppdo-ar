import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlppComponent } from './plpp.component';

describe('PlppComponent', () => {
  let component: PlppComponent;
  let fixture: ComponentFixture<PlppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
