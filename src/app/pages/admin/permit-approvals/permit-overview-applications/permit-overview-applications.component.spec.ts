import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitOverviewApplicationsComponent } from './permit-overview-applications.component';

describe('PermitOverviewApplicationsComponent', () => {
  let component: PermitOverviewApplicationsComponent;
  let fixture: ComponentFixture<PermitOverviewApplicationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitOverviewApplicationsComponent]
    });
    fixture = TestBed.createComponent(PermitOverviewApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
