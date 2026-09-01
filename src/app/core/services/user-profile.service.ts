import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiService } from './api.service';

// "Current signed-in user's profile" is a cross-cutting concern, the shared
// site header, the admin sidebar, and the applicant profile page all need it,
// so it lives in core rather than inside the applicant feature module. Keeping
// it out of ApplicantService avoids AdminModule (a separate lazy chunk) having
// to pull in an applicant-module-owned service just to show a display name.
@Injectable({ providedIn: 'root' })
export class UserProfileService extends ApiService {

  // Broadcasts whenever the signed-in user's profile is saved, so anything
  // caching a display name (the shared header's account menu, the admin
  // sidebar) knows to refetch it instead of showing stale info until the next login.
  private readonly profileUpdatedSource = new Subject<void>();
  readonly profileUpdated$ = this.profileUpdatedSource.asObservable();

  notifyProfileUpdated(): void {
    this.profileUpdatedSource.next();
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.Root_URL}/applicants-profile`, { headers: this.getHeaders() });
  }

  patchUserProfile(data: any, id: any): Observable<any> {
    return this.http.patch<any>(`${this.Root_URL}/applicants-profile/${id}`, data, { headers: this.getHeaders() });
  }
}
