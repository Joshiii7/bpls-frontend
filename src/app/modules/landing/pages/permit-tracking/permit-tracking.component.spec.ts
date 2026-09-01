import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitTrackingComponent } from './permit-tracking.component';

describe('PermitTrackingComponent', () => {
  let component: PermitTrackingComponent;
  let fixture: ComponentFixture<PermitTrackingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitTrackingComponent]
    });
    fixture = TestBed.createComponent(PermitTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
