import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitReviewDetailsComponent } from './permit-review-details.component';

describe('PermitReviewDetailsComponent', () => {
  let component: PermitReviewDetailsComponent;
  let fixture: ComponentFixture<PermitReviewDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitReviewDetailsComponent]
    });
    fixture = TestBed.createComponent(PermitReviewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
