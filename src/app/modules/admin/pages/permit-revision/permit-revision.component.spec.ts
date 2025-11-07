import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermitRevisionComponent } from './permit-revision.component';

describe('PermitRevisionComponent', () => {
  let component: PermitRevisionComponent;
  let fixture: ComponentFixture<PermitRevisionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PermitRevisionComponent]
    });
    fixture = TestBed.createComponent(PermitRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
