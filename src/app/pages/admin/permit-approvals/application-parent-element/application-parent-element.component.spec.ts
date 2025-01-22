import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationParentElementComponent } from './application-parent-element.component';

describe('ApplicationParentElementComponent', () => {
  let component: ApplicationParentElementComponent;
  let fixture: ComponentFixture<ApplicationParentElementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationParentElementComponent]
    });
    fixture = TestBed.createComponent(ApplicationParentElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
