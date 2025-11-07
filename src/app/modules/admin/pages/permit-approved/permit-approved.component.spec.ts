import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitApprovedComponent } from './permit-approved.component';

describe('PermitApprovedComponent', () => {
  let component: PermitApprovedComponent;
  let fixture: ComponentFixture<PermitApprovedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitApprovedComponent]
    });
    fixture = TestBed.createComponent(PermitApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
