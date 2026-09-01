import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqAccordionComponent } from './faq-accordion.component';

describe('FaqAccordionComponent', () => {
  let component: FaqAccordionComponent;
  let fixture: ComponentFixture<FaqAccordionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaqAccordionComponent]
    });
    fixture = TestBed.createComponent(FaqAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
