import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitDeclinedViewApplicationsComponent } from './permit-declined-view-applications.component';

describe('PermitDeclinedViewApplicationsComponent', () => {
  let component: PermitDeclinedViewApplicationsComponent;
  let fixture: ComponentFixture<PermitDeclinedViewApplicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitDeclinedViewApplicationsComponent]
    });
    fixture = TestBed.createComponent(PermitDeclinedViewApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
