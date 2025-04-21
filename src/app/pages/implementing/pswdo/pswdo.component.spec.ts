import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PswdoComponent } from './pswdo.component';

describe('PswdoComponent', () => {
  let component: PswdoComponent;
  let fixture: ComponentFixture<PswdoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PswdoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PswdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
