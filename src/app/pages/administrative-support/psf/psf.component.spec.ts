import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsfComponent } from './psf.component';

describe('PsfComponent', () => {
  let component: PsfComponent;
  let fixture: ComponentFixture<PsfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
