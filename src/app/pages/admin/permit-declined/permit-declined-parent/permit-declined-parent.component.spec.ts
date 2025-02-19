import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitDeclinedParentComponent } from './permit-declined-parent.component';

describe('PermitDeclinedParentComponent', () => {
  let component: PermitDeclinedParentComponent;
  let fixture: ComponentFixture<PermitDeclinedParentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitDeclinedParentComponent]
    });
    fixture = TestBed.createComponent(PermitDeclinedParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
