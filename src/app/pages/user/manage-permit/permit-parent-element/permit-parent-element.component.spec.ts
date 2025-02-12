import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitParentElementComponent } from './permit-parent-element.component';

describe('PermitParentElementComponent', () => {
  let component: PermitParentElementComponent;
  let fixture: ComponentFixture<PermitParentElementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitParentElementComponent]
    });
    fixture = TestBed.createComponent(PermitParentElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
