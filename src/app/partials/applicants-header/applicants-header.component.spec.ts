import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantsHeaderComponent } from './applicants-header.component';

describe('ApplicantsHeaderComponent', () => {
  let component: ApplicantsHeaderComponent;
  let fixture: ComponentFixture<ApplicantsHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantsHeaderComponent]
    });
    fixture = TestBed.createComponent(ApplicantsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
