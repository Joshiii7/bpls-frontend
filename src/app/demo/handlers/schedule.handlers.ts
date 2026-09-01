import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemoDbService } from '../demo-db.service';
import { ok } from '../mock-utils';

export function handleGetSchedules(_req: HttpRequest<any>, db: DemoDbService): Observable<any> {
  return ok(db.data.schedules);
}

export function handleCreateSchedule(req: HttpRequest<any>, db: DemoDbService): Observable<any> {
  const body = req.body || {};
  const schedule = {
    id: db.data.meta.nextScheduleId++,
    schedule_type: body.schedule_type,
    schedule_type_other: body.schedule_type_other || null,
    start_date: body.start_date,
    end_date: body.end_date,
    is_active: body.is_active ?? true,
  };
  db.data.schedules.push(schedule);
  db.save();
  return ok(schedule, 201);
}

export function handlePatchSchedule(req: HttpRequest<any>, db: DemoDbService, params: Record<string, string>): Observable<any> {
  const schedule = db.data.schedules.find(s => String(s.id) === params['id']);
  if (!schedule) return ok(null, 404);
  Object.assign(schedule, req.body || {});
  db.save();
  return ok(schedule);
}

export function handleDeleteSchedule(_req: HttpRequest<any>, db: DemoDbService, params: Record<string, string>): Observable<any> {
  db.data.schedules = db.data.schedules.filter(s => String(s.id) !== params['id']);
  db.save();
  return ok({ message: 'Schedule deleted.' });
}
