import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicParentComponent } from './public-parent.component';

describe('PublicParentComponent', () => {
  let component: PublicParentComponent;
  let fixture: ComponentFixture<PublicParentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublicParentComponent]
    });
    fixture = TestBed.createComponent(PublicParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
