import { Component } from '@angular/core';

interface Schedule {
  start_date: string;
  end_date: string;
  schedule_type: string;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
schedules: Schedule[] = [];

  // For binding form input
  newSchedule: Schedule = {
    start_date: '',
    end_date: '',
    schedule_type: ''
  };

  addSchedule() {
    if (this.newSchedule.start_date && this.newSchedule.end_date && this.newSchedule.schedule_type) {
      const now = new Date().toISOString();
      this.schedules.push({
        ...this.newSchedule,
      });

      this.newSchedule = { start_date: '', end_date: '', schedule_type: '' };
    }
  }

  removeSchedule(index: number) {
    this.schedules.splice(index, 1);
  }
}
