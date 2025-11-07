import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitDeclinedComponent } from './permit-declined.component';

describe('PermitDeclinedComponent', () => {
  let component: PermitDeclinedComponent;
  let fixture: ComponentFixture<PermitDeclinedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitDeclinedComponent]
    });
    fixture = TestBed.createComponent(PermitDeclinedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
