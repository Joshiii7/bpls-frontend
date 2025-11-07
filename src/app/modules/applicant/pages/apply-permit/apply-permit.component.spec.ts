import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyPermitComponent } from './apply-permit.component';

describe('ApplyPermitComponent', () => {
  let component: ApplyPermitComponent;
  let fixture: ComponentFixture<ApplyPermitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplyPermitComponent]
    });
    fixture = TestBed.createComponent(ApplyPermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
