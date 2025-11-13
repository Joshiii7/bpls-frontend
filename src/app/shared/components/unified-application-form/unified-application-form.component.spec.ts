import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnifiedApplicationFormComponent } from './unified-application-form.component';

describe('UnifiedApplicationFormComponent', () => {
  let component: UnifiedApplicationFormComponent;
  let fixture: ComponentFixture<UnifiedApplicationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnifiedApplicationFormComponent]
    });
    fixture = TestBed.createComponent(UnifiedApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
