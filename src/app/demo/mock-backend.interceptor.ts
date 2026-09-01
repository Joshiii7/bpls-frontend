import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemoDbService } from './demo-db.service';
import { API_ROOT } from './mock-utils';
import * as auth from './handlers/auth.handlers';
import * as applicant from './handlers/applicant.handlers';
import * as admin from './handlers/admin.handlers';
import * as schedule from './handlers/schedule.handlers';

type Handler = (req: HttpRequest<any>, db: DemoDbService, params: Record<string, string>) => Observable<any>;

interface Route {
  method: string;
  pattern: RegExp;
  keys: string[];
  handler: Handler;
}

function route(method: string, path: string, handler: Handler): Route {
  const keys: string[] = [];
  const regexSource = path
    .split('/')
    .map(segment => {
      if (segment.startsWith(':')) {
        keys.push(segment.slice(1));
        return '([^/]+)';
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');

  return { method, pattern: new RegExp(`^${regexSource}$`), keys, handler };
}

// This app was written against a real Laravel backend at bisligcitybpls.com. Every route
// below mirrors one endpoint from api-services.service.ts / core services, so the frontend
// keeps working unmodified while everything actually reads and writes the local demo "database".
const ROUTES: Route[] = [
  route('POST', '/login', auth.handleLogin),
  route('POST', '/googleLogin', auth.handleGoogleLogin),
  route('POST', '/register', auth.handleRegister),
  route('POST', '/logout', auth.handleLogout),
  route('GET', '/userRole', auth.handleUserRole),

  route('GET', '/applicants-application', applicant.handleGetApplications),
  route('POST', '/applicants-application', applicant.handleSubmitApplication),
  route('GET', '/applicants-application/:uuid', applicant.handleGetApplicationDetail),
  route('PATCH', '/applicants-application/:uuid', applicant.handleUpdateApplication),
  route('GET', '/applicants-profile', applicant.handleGetUserProfile),
  route('PATCH', '/applicants-profile/:id', applicant.handlePatchUserProfile),
  route('GET', '/system-notifications', applicant.handleGetNotifications),
  route('PATCH', '/system-notifications/read-all', applicant.handleMarkAllNotificationsRead),
  route('GET', '/check-phone', applicant.handleCheckPhone),

  route('GET', '/admin-reports', admin.handleAdminReports),
  route('GET', '/admin-permits', admin.handleAdminPermits),
  route('GET', '/admin-permits/:uuid', admin.handleShowAdminPermit),
  route('GET', '/department-approval/:uuid', admin.handleShowDepartmentApproval),
  route('PATCH', '/department-approval/:uuid', admin.handlePatchDepartmentApproval),
  route('GET', '/allBusiness', admin.handleAllBusiness),
  route('GET', '/searchBusinesses', admin.handleSearchBusinesses),
  route('GET', '/applicationDetail/:uuid', admin.handleApplicationDetail),
  route('PATCH', '/approveApplication/:id', admin.handleApproveApplication),
  route('PATCH', '/declineApplication/:id', admin.handleDeclineApplication),

  route('GET', '/permit-schedules', schedule.handleGetSchedules),
  route('POST', '/permit-schedules', schedule.handleCreateSchedule),
  route('PATCH', '/permit-schedules/:id', schedule.handlePatchSchedule),
  route('DELETE', '/permit-schedules/:id', schedule.handleDeleteSchedule),
];

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
  constructor(private db: DemoDbService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.startsWith(API_ROOT)) {
      return next.handle(req);
    }

    const path = req.url.slice(API_ROOT.length).split('?')[0];

    for (const candidate of ROUTES) {
      if (candidate.method !== req.method) continue;
      const match = candidate.pattern.exec(path);
      if (!match) continue;

      const params: Record<string, string> = {};
      candidate.keys.forEach((key, i) => (params[key] = decodeURIComponent(match[i + 1])));

      return candidate.handler(req, this.db, params);
    }

    console.warn(`[demo mock backend] No handler for ${req.method} ${path}`);
    return next.handle(req);
  }
}
