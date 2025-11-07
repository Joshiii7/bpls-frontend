import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitReviewComponent } from './permit-review.component';

describe('PermitReviewComponent', () => {
  let component: PermitReviewComponent;
  let fixture: ComponentFixture<PermitReviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitReviewComponent]
    });
    fixture = TestBed.createComponent(PermitReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
