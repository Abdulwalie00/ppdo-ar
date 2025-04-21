import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpagComponent } from './opag.component';

describe('OpagComponent', () => {
  let component: OpagComponent;
  let fixture: ComponentFixture<OpagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpagComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
