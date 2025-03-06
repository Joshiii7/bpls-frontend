import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyApplicationParentComponent } from './my-application-parent.component';

describe('MyApplicationParentComponent', () => {
  let component: MyApplicationParentComponent;
  let fixture: ComponentFixture<MyApplicationParentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyApplicationParentComponent]
    });
    fixture = TestBed.createComponent(MyApplicationParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
