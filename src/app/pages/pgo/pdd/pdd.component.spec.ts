import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PddComponent } from './pdd.component';

describe('PddComponent', () => {
  let component: PddComponent;
  let fixture: ComponentFixture<PddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
