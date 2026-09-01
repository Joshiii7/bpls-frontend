import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DemoDbService } from '../demo-db.service';
import { fail, ok } from '../mock-utils';

const DEMO_TOKEN = 'demo-session-token';

export function handleLogin(req: HttpRequest<any>, db: DemoDbService): Observable<any> {
  const { email, password } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = db.data.users.find(
    u => u.email.toLowerCase() === normalizedEmail && u.password === String(password || '')
  );

  if (!user) {
    // No token in the body: login-form.component.ts already treats this as "invalid
    // credentials" and shows the matching error dialog, so a 200 with no token is the
    // natural failure shape.
    return ok({});
  }

  return ok({ token: DEMO_TOKEN, role: user.role, user: user.id });
}

export function handleGoogleLogin(_req: HttpRequest<any>, db: DemoDbService): Observable<any> {
  const user = db.data.users[0];
  return ok({ token: DEMO_TOKEN, role: user.role, user: user.id });
}

export function handleRegister(_req: HttpRequest<any>): Observable<any> {
  return ok({ message: 'Registration is simulated in this demo.' });
}

export function handleLogout(): Observable<any> {
  return ok({});
}

export function handleUserRole(req: HttpRequest<any>, db: DemoDbService): Observable<any> {
  const authHeader = req.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token || token === 'null') {
    return fail(401, 'Unauthenticated.');
  }

  // The demo token itself isn't user-specific, so identify the session from the
  // user id login-form.component.ts stored in localStorage rather than always
  // resolving to the first seeded user. That distinction only matters now that
  // there's more than one demo account (admin and business owner).
  const currentUserId = Number(localStorage.getItem('u'));
  const user = db.data.users.find(u => u.id === currentUserId) || db.data.users[0];
  return ok({ user: [{ id: user.id, user_role: { role_name: user.role_name } }] });
}
