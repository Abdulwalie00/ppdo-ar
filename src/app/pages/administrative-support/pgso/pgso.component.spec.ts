import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgsoComponent } from './pgso.component';

describe('PgsoComponent', () => {
  let component: PgsoComponent;
  let fixture: ComponentFixture<PgsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgsoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
