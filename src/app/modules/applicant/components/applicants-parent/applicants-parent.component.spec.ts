import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantsParentComponent } from './applicants-parent.component';

describe('ApplicantsParentComponent', () => {
  let component: ApplicantsParentComponent;
  let fixture: ComponentFixture<ApplicantsParentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantsParentComponent]
    });
    fixture = TestBed.createComponent(ApplicantsParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
