import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RydoComponent } from './rydo.component';

describe('RydoComponent', () => {
  let component: RydoComponent;
  let fixture: ComponentFixture<RydoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RydoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RydoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
