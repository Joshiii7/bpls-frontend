import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessOperationFormComponent } from './business-operation-form.component';

describe('BusinessOperationFormComponent', () => {
  let component: BusinessOperationFormComponent;
  let fixture: ComponentFixture<BusinessOperationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessOperationFormComponent]
    });
    fixture = TestBed.createComponent(BusinessOperationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
