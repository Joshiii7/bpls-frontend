import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServicesService } from 'src/app/api-services.service';
import Swal from 'sweetalert2';

interface CalendarDay {
  date: Date;
  label: number;
  inMonth: boolean;
  iso: string;
}

interface Schedule {
  id: number;
  schedule_type: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
  current = new Date();
  weeks: CalendarDay[][] = [];

  startDate: Date | null = null;
  endDate: Date | null = null;

  currentPage = 1;
  perPage = 5;
  total = 0;
  start = 0;
  end = 0;
  schedules: Schedule[] = [];
  paginatedSchedules: Schedule[] = [];

  scheduleForm: FormGroup = this.formBuilder.group({
    scheduleType: ['', [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private apiServices: ApiServicesService
  ) {

  }

  ngOnInit() {
    this.getSchedule();
    this.generateCalendar();
  }

  getSchedule() {
    this.apiServices.getPermitSchedule().subscribe({
      next: (response: any) => {
        this.schedules = response;
        this.total = this.schedules.length;
        this.changePage(this.currentPage);
      },
      error: (err: any) => {
        console.error("Error fetching permit schedules: ", err);
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.perPage);
  }

  changePage(page: number) {
    if (page < 1) page = 1;
    if (page > Math.ceil(this.total / this.perPage)) page = Math.ceil(this.total / this.perPage);

    this.currentPage = page;
    this.start = (page - 1) * this.perPage + 1;
    this.end = Math.min(this.start + this.perPage - 1, this.total);

    this.paginatedSchedules = this.schedules.slice(this.start - 1, this.end);
  }

  getVisiblePages(): number[] {
    const totalPages = Math.ceil(this.total / this.perPage);
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Generate calendar matrix for current month
  generateCalendar() {
    const year = this.current.getFullYear();
    const month = this.current.getMonth();
    const firstDay = new Date(year, month, 1);
    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - firstDay.getDay());

    this.weeks = [];
    let day = new Date(start);

    for (let w = 0; w < 6; w++) {
      const week: CalendarDay[] = [];
      for (let d = 0; d < 7; d++) {
        week.push({
          date: new Date(day),
          label: day.getDate(),
          inMonth: day.getMonth() === month,
          iso: this.toISO(day)
        });
        day.setDate(day.getDate() + 1);
      }
      this.weeks.push(week);
    }
  }

  // Go to next/previous months
  nextMonth() {
    this.current = new Date(this.current.getFullYear(), this.current.getMonth() + 1, 1);
    this.generateCalendar();
  }

  prevMonth() {
    this.current = new Date(this.current.getFullYear(), this.current.getMonth() - 1, 1);
    this.generateCalendar();
  }

  monthTitle() {
    return this.current.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  // Handle date click
  onPick(day: CalendarDay) {
    if (!this.startDate || (this.startDate && this.endDate)) {
      this.startDate = day.date;
      this.endDate = null;
    } else if (this.startDate && !this.endDate) {
      if (day.date >= this.startDate) {
        this.endDate = day.date;
      } else {
        this.endDate = this.startDate;
        this.startDate = day.date;
      }
    }
  }

  // Convert to YYYY-MM-DD
  toISO(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Check if date is in selected range
  isInRange(day: CalendarDay): boolean {
    if (!this.startDate || !this.endDate) return false;
    return day.date >= this.startDate && day.date <= this.endDate;
  }

  // ✅ Check if date is today
  isToday(day: CalendarDay): boolean {
    const today = new Date();
    return (
      day.date.getDate() === today.getDate() &&
      day.date.getMonth() === today.getMonth() &&
      day.date.getFullYear() === today.getFullYear()
    );
  }

  addSchedule() {
    if (!this.scheduleForm.value || !this.startDate || !this.endDate) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please complete the schedule details.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Understood!'
      });
      return;
    }

    const newSchedule: any = {
      schedule_type: this.scheduleForm.value.scheduleType,
      start_date: this.toISO(this.startDate),
      end_date: this.toISO(this.endDate),
      is_active: true
    };

    this.apiServices.postPermitSchedule(newSchedule).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Schedule added successfully!',
          confirmButtonColor: '#009800',
          confirmButtonText: 'Ok'
        });
        this.getSchedule();
        this.scheduleForm.reset();
        this.startDate = null;
        this.endDate = null;
      },
      error: (err: any) => {
        console.error('Error creating schedule:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add schedule.',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  clearScheduleForm() {
    this.scheduleForm.reset();
    this.startDate = null;
    this.endDate = null;
  }

  removeSchedule(schedule: Schedule) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete schedule ${schedule.schedule_type}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#009800'
    }).then(result => {
      if (result.isConfirmed) {
        this.apiServices.deletePermitSchedule(schedule.id).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: `Schedule has been deleted.`,
            confirmButtonColor: '#009800',
          });
          this.getSchedule();
        });
      }
    });
  }

  toggleActive(schedule: Schedule, event: Event) {
    event.preventDefault();
    const previousStatus = schedule.is_active;
    const action = schedule.is_active ? 'deactivate' : 'activate';
    Swal.fire({
      title: `Are you sure you want to ${action} this schedule?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#009800',
    }).then((result) => {
      if (result.isConfirmed) {
        schedule.is_active = !schedule.is_active;
        this.apiServices.patchPermitSchedule({ is_active: schedule.is_active }, schedule.id).subscribe({
          next: (response: any) => {
            this.getSchedule();
            console.log('Status updated successfully:', response);
            Swal.fire({
              title: 'Success',
              text: `Schedule has been ${action}d.`,
              icon: 'success',
              confirmButtonColor: '#009800',
            });
          },
          error: (err: any) => {
            console.error('Error updating the status:', err);
            schedule.is_active = previousStatus;
            Swal.fire({
              title: 'Error',
              text: 'Failed to update status.',
              icon: 'error',
              confirmButtonColor: '#009800',
            });
          }
        });
      } else {
        schedule.is_active = previousStatus;
      }
    });
  }
}