import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantApplicationDetailsComponent } from './applicant-application-details.component';

describe('ApplicantApplicationDetailsComponent', () => {
  let component: ApplicantApplicationDetailsComponent;
  let fixture: ComponentFixture<ApplicantApplicationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantApplicationDetailsComponent]
    });
    fixture = TestBed.createComponent(ApplicantApplicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
