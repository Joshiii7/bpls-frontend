import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemoDbService } from '../demo-db.service';
import { formatDate, getRawQueryParam, ok } from '../mock-utils';
import { toDetailShape, toFlatPermitShape, toListRow } from '../projectors';
import { BUSINESS_TYPES } from '../seed-data';

const MONTH_ORDER = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function handleAdminReports(_req: HttpRequest<any>, db: DemoDbService): Observable<any> {
  // Drafts haven't been submitted yet, so they don't belong in office-facing reports.
  const apps = db.data.applications.filter(a => !a.is_draft);
  const totalPermits = apps.length;
  const totalPending = apps.filter(a => a.status === 'Pending').length;
  const totalApproved = apps.filter(a => a.status === 'Approved').length;
  const totalDeclined = apps.filter(a => a.status === 'Declined').length;

  const businessTypes: Record<string, number> = {};
  Object.values(BUSINESS_TYPES).forEach(name => (businessTypes[name] = 0));
  apps.forEach(a => (businessTypes[a.business_type] = (businessTypes[a.business_type] || 0) + 1));

  const applicationTypeCounts = { New: 0, Renewal: 0 };
  apps.forEach(a => { applicationTypeCounts[a.application_type]++; });

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const submittedThisWeek = apps.filter(a => new Date(a.created_at).getTime() >= oneWeekAgo.getTime()).length;

  const monthlyStatus: Record<string, { submitted: number; approved: number; declined: number }> = {};
  MONTH_ORDER.forEach(m => (monthlyStatus[m] = { submitted: 0, approved: 0, declined: 0 }));
  apps.forEach(a => {
    const monthIndex = new Date(a.created_at).getMonth();
    const month = MONTH_ORDER[isNaN(monthIndex) ? 0 : monthIndex];
    monthlyStatus[month].submitted++;
    if (a.status === 'Approved') monthlyStatus[month].approved++;
    if (a.status === 'Declined') monthlyStatus[month].declined++;
  });

  const permitAging = apps
    .filter(a => a.status === 'Pending')
    .map(a => ({
      tracking_number: a.tracking_number,
      business_name: a.business_name,
      owner_name: a.owner,
      days_pending: a.days_pending,
    }));

  return ok({
    totalPermits, totalPending, totalApproved, totalDeclined,
    submittedThisWeek, applicationTypeCounts,
    businessTypes, monthlyStatus, permitAging,
  });
}

export function handleAdminPermits(_req: HttpRequest<any>, db: DemoDbService): Observable<any> {
  const rows = db.data.applications.filter(a => a.status === 'Pending').map(toListRow);
  return ok({ businessess: rows });
}

export function handleShowAdminPermit(_req: HttpRequest<any>, db: DemoDbService, params: Record<string, string>): Observable<any> {
  const app = db.data.applications.find(a => a.uuid === params['uuid']);
  if (!app) return ok(null, 404);
  return ok(toDetailShape(app));
}

export function handleShowDepartmentApproval(_req: HttpRequest<any>, db: DemoDbService, params: Record<string, string>): Observable<any> {
  const app = db.data.applications.find(a => a.uuid === params['uuid']);
  if (!app) return ok([]);
  return ok(app.departments);
}

export function handlePatchDepartmentApproval(req: HttpRequest<any>, db: DemoDbService, params: Record<string, string>): Observable<any> {
  const app = db.data.applications.find(a => a.uuid === params['uuid']);
  if (!app) return ok(null, 404);

  const { department, status, notes } = req.body || {};
  const dept = app.departments.find(d => d.department === department);
  const wasAllPending = app.departments.every(d => d.status === 'Pending');
  const prevOverallStatus = app.status;

  if (dept) {
    dept.status = status;
    dept.notes = notes ?? dept.notes;
  }

  if (app.departments.some(d => d.status === 'Declined')) {
    app.status = 'Declined';
    app.application_status = 'Declined';
  } else if (app.departments.every(d => d.status === 'Approved')) {
    app.status = 'Approved';
    app.application_status = 'Approved';
  } else {
    app.status = 'Pending';
    app.application_status = 'Pending';
  }

  const now = formatDate();
  app.updated_at = now;

  if (wasAllPending && app.departments.some(d => d.status !== 'Pending')) {
    app.history.push({ status: 'Under Review', date: now, note: 'Being reviewed by the concerned departments.' });
  }
  if (app.status !== prevOverallStatus) {
    if (app.status === 'Approved') {
      app.history.push({ status: 'Approved', date: now, note: 'All departments have approved the application.' });
    } else if (app.status === 'Declined') {
      app.history.push({ status: 'Declined', date: now, note: notes ? `Declined by ${department}: ${notes}` : `Declined by ${department}.` });
    }
  }

  db.save();
  return ok(dept || {});
}

export function handleAllBusiness(_req: HttpRequest<any>, db: DemoDbService): Observable<any> {
  const apps = db.data.applications.filter(a => !a.is_draft);
  const businessess = apps.filter(a => a.status === 'Pending').map(toListRow);
  const approvedBusiness = apps.filter(a => a.status === 'Approved').map(toListRow);
  const declinedBusiness = apps.filter(a => a.status === 'Declined').map(toListRow);
  return ok({ businessess, approvedBusiness, declinedBusiness, data: apps.map(toListRow) });
}

export function handleSearchBusinesses(req: HttpRequest<any>, db: DemoDbService): Observable<any> {
  const search = getRawQueryParam(req.urlWithParams, 'search').toLowerCase().trim();

  const results = db.data.applications
    .filter(a => !a.is_draft)
    .filter(a =>
      !search ||
      a.business_name.toLowerCase().includes(search) ||
      a.owner.toLowerCase().includes(search) ||
      a.tracking_number.toLowerCase().includes(search)
    )
    .map(toListRow);

  return ok({ data: results, pagination: { last_page: 1, total: results.length } });
}

export function handleApplicationDetail(_req: HttpRequest<any>, db: DemoDbService, params: Record<string, string>): Observable<any> {
  const app = db.data.applications.find(a => a.uuid === params['uuid']);
  if (!app) return ok({ permit: null }, 404);
  return ok(toFlatPermitShape(app));
}

export function handleApproveApplication(_req: HttpRequest<any>, db: DemoDbService, params: Record<string, string>): Observable<any> {
  const app = db.data.applications.find(a => String(a.id) === params['id']);
  if (!app) return ok(null, 404);

  app.status = 'Approved';
  app.application_status = 'Approved';
  app.departments.forEach(d => (d.status = 'Approved'));
  const now = formatDate();
  app.updated_at = now;
  app.history.push({ status: 'Approved', date: now, note: 'All departments have approved the application.' });
  db.save();
  return ok({ message: 'Application approved.' });
}

export function handleDeclineApplication(req: HttpRequest<any>, db: DemoDbService, params: Record<string, string>): Observable<any> {
  const app = db.data.applications.find(a => String(a.id) === params['id']);
  if (!app) return ok(null, 404);

  app.status = 'Declined';
  app.application_status = 'Declined';
  const reason = req.body?.reason;
  if (reason) {
    const firstOpen = app.departments.find(d => d.status !== 'Declined') || app.departments[0];
    firstOpen.status = 'Declined';
    firstOpen.notes = reason;
  }
  const now = formatDate();
  app.updated_at = now;
  app.history.push({ status: 'Declined', date: now, note: reason || 'The application was declined.' });
  db.save();
  return ok({ message: 'Application declined.' });
}
