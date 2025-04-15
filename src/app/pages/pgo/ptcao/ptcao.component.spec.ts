import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtcaoComponent } from './ptcao.component';

describe('PtcaoComponent', () => {
  let component: PtcaoComponent;
  let fixture: ComponentFixture<PtcaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PtcaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtcaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
