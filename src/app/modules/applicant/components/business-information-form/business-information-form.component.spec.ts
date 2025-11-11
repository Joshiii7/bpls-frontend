import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessInformationFormComponent } from './business-information-form.component';

describe('BusinessInformationFormComponent', () => {
  let component: BusinessInformationFormComponent;
  let fixture: ComponentFixture<BusinessInformationFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessInformationFormComponent]
    });
    fixture = TestBed.createComponent(BusinessInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
