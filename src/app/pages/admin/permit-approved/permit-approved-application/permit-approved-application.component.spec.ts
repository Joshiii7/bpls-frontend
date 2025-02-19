import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitApprovedApplicationComponent } from './permit-approved-application.component';

describe('PermitApprovedApplicationComponent', () => {
  let component: PermitApprovedApplicationComponent;
  let fixture: ComponentFixture<PermitApprovedApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitApprovedApplicationComponent]
    });
    fixture = TestBed.createComponent(PermitApprovedApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
