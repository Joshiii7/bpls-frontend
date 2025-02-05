import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewMapComponent } from './review-map.component';

describe('ReviewMapComponent', () => {
  let component: ReviewMapComponent;
  let fixture: ComponentFixture<ReviewMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewMapComponent]
    });
    fixture = TestBed.createComponent(ReviewMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
