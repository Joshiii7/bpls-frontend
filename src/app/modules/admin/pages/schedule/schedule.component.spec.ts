import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ScheduleComponent } from './schedule.component';

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the three required Permit Schedule options with the exact labels', () => {
    const options: NodeListOf<HTMLOptionElement> = fixture.nativeElement.querySelectorAll('#schedule option');
    const labels = Array.from(options).map(o => o.textContent?.trim());
    expect(labels).toContain('New Business Permit Period');
    expect(labels).toContain('Business Permit Renewal Period');
    expect(labels).toContain('Others');
  });

  it('does not show the "please specify" input for New Business Permit Period', () => {
    component.scheduleForm.get('scheduleType')?.setValue('new');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#scheduleTypeOther')).toBeNull();
  });

  it('does not show the "please specify" input for Business Permit Renewal Period', () => {
    component.scheduleForm.get('scheduleType')?.setValue('renewal');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#scheduleTypeOther')).toBeNull();
  });

  it('shows the "please specify" input as soon as Others is selected in the actual rendered select', () => {
    expect(fixture.nativeElement.querySelector('#scheduleTypeOther')).toBeNull();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#schedule');
    select.value = 'others';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#scheduleTypeOther');
    expect(input).not.toBeNull();
  });

  it('requires the "please specify" input when Others is selected', () => {
    const scheduleType = component.scheduleForm.get('scheduleType')!;
    const scheduleTypeOther = component.scheduleForm.get('scheduleTypeOther')!;

    scheduleType.setValue('others');
    fixture.detectChanges();
    expect(scheduleTypeOther.invalid).toBeTrue();

    scheduleTypeOther.setValue('Fire safety inspection week');
    expect(scheduleTypeOther.valid).toBeTrue();
  });

  it('clears the custom value and hides the input when switching away from Others', () => {
    const scheduleType = component.scheduleForm.get('scheduleType')!;
    const scheduleTypeOther = component.scheduleForm.get('scheduleTypeOther')!;

    scheduleType.setValue('others');
    scheduleTypeOther.setValue('Fire safety inspection week');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#scheduleTypeOther')).not.toBeNull();

    scheduleType.setValue('new');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#scheduleTypeOther')).toBeNull();
    expect(scheduleTypeOther.value).toBe('');
  });
});
