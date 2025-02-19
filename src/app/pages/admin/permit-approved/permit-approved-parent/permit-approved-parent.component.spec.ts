import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitApprovedParentComponent } from './permit-approved-parent.component';

describe('PermitApprovedParentComponent', () => {
  let component: PermitApprovedParentComponent;
  let fixture: ComponentFixture<PermitApprovedParentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitApprovedParentComponent]
    });
    fixture = TestBed.createComponent(PermitApprovedParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
