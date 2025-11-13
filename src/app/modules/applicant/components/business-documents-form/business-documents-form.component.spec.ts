import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessDocumentsFormComponent } from './business-documents-form.component';

describe('BusinessDocumentsFormComponent', () => {
  let component: BusinessDocumentsFormComponent;
  let fixture: ComponentFixture<BusinessDocumentsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessDocumentsFormComponent]
    });
    fixture = TestBed.createComponent(BusinessDocumentsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
