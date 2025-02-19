import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitDeclinedApplicationsComponent } from './permit-declined-applications.component';

describe('PermitDeclinedApplicationsComponent', () => {
  let component: PermitDeclinedApplicationsComponent;
  let fixture: ComponentFixture<PermitDeclinedApplicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitDeclinedApplicationsComponent]
    });
    fixture = TestBed.createComponent(PermitDeclinedApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
