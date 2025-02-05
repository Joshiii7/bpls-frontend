import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleSidebarComponent } from './sample-sidebar.component';

describe('SampleSidebarComponent', () => {
  let component: SampleSidebarComponent;
  let fixture: ComponentFixture<SampleSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SampleSidebarComponent]
    });
    fixture = TestBed.createComponent(SampleSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
