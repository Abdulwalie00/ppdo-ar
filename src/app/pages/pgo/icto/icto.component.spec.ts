import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IctoComponent } from './icto.component';

describe('IctoComponent', () => {
  let component: IctoComponent;
  let fixture: ComponentFixture<IctoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IctoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IctoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
