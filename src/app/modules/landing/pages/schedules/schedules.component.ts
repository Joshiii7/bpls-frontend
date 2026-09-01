import { Component, OnInit } from '@angular/core';
import { ApiServicesService } from 'src/app/api-services.service';

interface ScheduleEntry {
  id: number;
  schedule_type: string;
  schedule_type_other: string | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface ScheduleGroup {
  monthLabel: string;
  entries: ScheduleEntry[];
}

// Reads from the exact same endpoint the admin calendar uses
// (ApiServicesService.getPermitSchedule -> /permit-schedules), so anything an
// admin adds, edits, or deletes there shows up here automatically. There is
// no separate, hand-typed list of schedules on this page.
//
// The schedule model has no draft/published/private field, only `is_active`
// (the same switch the admin toggles on the calendar). Rather than hiding
// inactive entries outright, this page shows them with a clearly different
// "Currently Unavailable" status, since that's the closest real signal the
// data gives us for "this period isn't open right now."
@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.css']
})
export class SchedulesComponent implements OnInit {
  isLoading = true;
  hasError = false;
  groups: ScheduleGroup[] = [];

  constructor(private api: ApiServicesService) {
    document.title = 'BPLS | Schedules';
  }

  ngOnInit(): void {
    this.api.getPermitSchedule().subscribe({
      next: (response: any) => {
        const entries: ScheduleEntry[] = Array.isArray(response) ? response : [];
        entries.sort((a, b) => a.start_date.localeCompare(b.start_date));
        this.groups = this.groupByMonth(entries);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching schedules:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  private groupByMonth(entries: ScheduleEntry[]): ScheduleGroup[] {
    const groups = new Map<string, ScheduleEntry[]>();

    for (const entry of entries) {
      const label = this.parseLocalDate(entry.start_date).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groups.has(label)) {
        groups.set(label, []);
      }
      groups.get(label)!.push(entry);
    }

    return Array.from(groups.entries()).map(([monthLabel, groupEntries]) => ({ monthLabel, entries: groupEntries }));
  }

  // "YYYY-MM-DD" parsed with `new Date(iso)` is treated as UTC midnight, which
  // can display as the previous day in timezones behind UTC. Building the
  // Date from its parts keeps it in local time instead.
  private parseLocalDate(iso: string): Date {
    const [year, month, day] = iso.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  formatDateRange(entry: ScheduleEntry): string {
    const start = this.parseLocalDate(entry.start_date);
    const end = this.parseLocalDate(entry.end_date);

    if (entry.start_date === entry.end_date) {
      return start.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    const startLabel = start.toLocaleDateString('default', { month: 'short', day: 'numeric' });

    if (sameMonth) {
      return `${startLabel} to ${end.getDate()}, ${end.getFullYear()}`;
    }

    const endLabel = end.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startLabel} to ${endLabel}`;
  }
}
