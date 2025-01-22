import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitViewApplicationDetailsComponent } from './permit-view-application-details.component';

describe('PermitViewApplicationDetailsComponent', () => {
  let component: PermitViewApplicationDetailsComponent;
  let fixture: ComponentFixture<PermitViewApplicationDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitViewApplicationDetailsComponent]
    });
    fixture = TestBed.createComponent(PermitViewApplicationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
