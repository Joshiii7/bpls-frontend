import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewPermitComponent } from './renew-permit.component';

describe('RenewPermitComponent', () => {
  let component: RenewPermitComponent;
  let fixture: ComponentFixture<RenewPermitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RenewPermitComponent]
    });
    fixture = TestBed.createComponent(RenewPermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
