import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitApprovedViewApplicationComponent } from './permit-approved-view-application.component';

describe('PermitApprovedViewApplicationComponent', () => {
  let component: PermitApprovedViewApplicationComponent;
  let fixture: ComponentFixture<PermitApprovedViewApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitApprovedViewApplicationComponent]
    });
    fixture = TestBed.createComponent(PermitApprovedViewApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
