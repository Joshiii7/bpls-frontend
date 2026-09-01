import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { ApplyPermitComponent } from './apply-permit.component';

describe('ApplyPermitComponent', () => {
  let component: ApplyPermitComponent;
  let fixture: ComponentFixture<ApplyPermitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplyPermitComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap({}) } }
        }
      ]
    });
    fixture = TestBed.createComponent(ApplyPermitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not show the "please specify" input for New Application', () => {
    component.permitScheduleForm.get('scheduleType')?.setValue('new');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('#scheduleOther');
    expect(input).toBeNull();
  });

  it('does not show the "please specify" input for Business Permit Renewal Period', () => {
    component.permitScheduleForm.get('scheduleType')?.setValue('renewal');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('#scheduleOther');
    expect(input).toBeNull();
  });

  it('shows the "please specify" input as soon as Others is selected', () => {
    let input = fixture.nativeElement.querySelector('#scheduleOther');
    expect(input).toBeNull();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#scheduleType');
    select.value = 'others';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    input = fixture.nativeElement.querySelector('#scheduleOther');
    expect(input).not.toBeNull();
  });

  it('requires the "please specify" input when Others is selected', () => {
    const scheduleType = component.permitScheduleForm.get('scheduleType')!;
    const scheduleOther = component.permitScheduleForm.get('scheduleOther')!;

    scheduleType.setValue('others');
    fixture.detectChanges();
    expect(scheduleOther.invalid).toBeTrue();

    scheduleOther.setValue('Change of business name');
    expect(scheduleOther.valid).toBeTrue();
  });

  it('clears the custom value and hides the input when switching away from Others', () => {
    const scheduleType = component.permitScheduleForm.get('scheduleType')!;
    const scheduleOther = component.permitScheduleForm.get('scheduleOther')!;

    scheduleType.setValue('others');
    scheduleOther.setValue('Change of business name');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#scheduleOther')).not.toBeNull();

    scheduleType.setValue('new');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#scheduleOther')).toBeNull();
    expect(scheduleOther.value).toBe('');
  });
});
