import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PvoComponent } from './pvo.component';

describe('PvoComponent', () => {
  let component: PvoComponent;
  let fixture: ComponentFixture<PvoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PvoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PvoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
