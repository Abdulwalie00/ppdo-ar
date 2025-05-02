import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhrmoComponent } from './phrmo.component';

describe('PhrmoComponent', () => {
  let component: PhrmoComponent;
  let fixture: ComponentFixture<PhrmoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhrmoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhrmoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
