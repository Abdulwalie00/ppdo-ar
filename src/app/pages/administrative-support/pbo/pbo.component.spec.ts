import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PboComponent } from './pbo.component';

describe('PboComponent', () => {
  let component: PboComponent;
  let fixture: ComponentFixture<PboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PboComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
