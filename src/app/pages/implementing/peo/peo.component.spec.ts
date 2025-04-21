import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeoComponent } from './peo.component';

describe('PeoComponent', () => {
  let component: PeoComponent;
  let fixture: ComponentFixture<PeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
