import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantProfileComponent } from './applicant-profile.component';

describe('ApplicantProfileComponent', () => {
  let component: ApplicantProfileComponent;
  let fixture: ComponentFixture<ApplicantProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantProfileComponent]
    });
    fixture = TestBed.createComponent(ApplicantProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
