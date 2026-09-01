import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DemoDbService } from './demo-db.service';
import { DemoUser } from './models';

// Must match the Root_URL hardcoded in api-services.service.ts / core/services/api.service.ts.
export const API_ROOT = 'https://bisligcitybpls.com/public/api';

// Small artificial delay so loading spinners/skeletons in the UI are visible, like a real network call.
const RESPONSE_DELAY_MS = 350;

export function ok(body: any, status = 200): Observable<HttpResponse<any>> {
  return of(new HttpResponse({ status, body })).pipe(delay(RESPONSE_DELAY_MS));
}

export function fail(status: number, message: string): Observable<never> {
  return new Observable(subscriber => {
    setTimeout(() => {
      subscriber.error({ status, error: { message } });
    }, RESPONSE_DELAY_MS);
  });
}

export function genUuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Pulls a single query param's raw value out of a request URL by hand, without going through
// URLSearchParams. Several endpoints in this app build their query string by string-interpolating
// an unencoded value straight into the URL template (e.g. "?number=+63 912 345 6789"), and
// URLSearchParams treats literal "+" as an encoded space, which would silently corrupt a PH
// phone number. A plain substring split preserves the value exactly as the app sent it.
export function getRawQueryParam(url: string, key: string): string {
  const queryString = url.split('?')[1] || '';
  const pair = queryString.split('&').find(p => p.startsWith(`${key}=`));
  return pair ? pair.slice(key.length + 1) : '';
}

// Turns a FormData payload (including bracketed keys like "documents[0][file]")
// back into a plain nested object, the way it looked before ApplyPermitComponent flattened it.
export function formDataToObject(fd: FormData): any {
  const root: any = {};

  fd.forEach((value, key) => {
    const segments = key.replace(/\]/g, '').split('[');
    let cursor = root;

    segments.forEach((segment, i) => {
      const isLast = i === segments.length - 1;

      if (isLast) {
        cursor[segment] = value instanceof File ? value.name : value;
        return;
      }

      const nextIsIndex = /^\d+$/.test(segments[i + 1]);
      if (cursor[segment] === undefined) {
        cursor[segment] = nextIsIndex ? [] : {};
      }
      cursor = cursor[segment];
    });
  });

  return root;
}

// Resolves the signed-in user from the id login-form.component.ts stored in
// localStorage, the same mechanism handleUserRole uses. Falls back to the first
// seeded user so handlers never blow up if called before a real login happens.
export function getCurrentUser(db: DemoDbService): DemoUser {
  const currentUserId = Number(localStorage.getItem('u'));
  return db.data.users.find(u => u.id === currentUserId) || db.data.users[0];
}

// Lightweight labeled placeholder image (as a data URI) used for seeded documents/signatures
// so the demo never depends on real uploaded files or an external image host.
export function placeholderImage(label: string, bg = '#e2e8f0', fg = '#334155'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320">
    <rect width="100%" height="100%" fill="${bg}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="22" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
