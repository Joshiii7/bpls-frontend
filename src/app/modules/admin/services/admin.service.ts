import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService extends ApiService {

  getAdminReports(): Observable<any> {
    return this.http.get<any>(`${this.Root_URL}/admin-reports`, { headers: this.getHeaders() });
  }

  getAdminPermits(): Observable<any> {
    return this.http.get<any>(`${this.Root_URL}/admin-permits`, { headers: this.getHeaders() });
  }

  // Single call returning every submitted application, already split by status
  // (businessess = pending, approvedBusiness, declinedBusiness, data = all).
  // Backs the Applications list for every status tab so admin and applicant
  // sides read from the same records instead of separate queries drifting out
  // of sync.
  getAllApplications(): Observable<any> {
    return this.http.get<any>(`${this.Root_URL}/allBusiness`, { headers: this.getHeaders() });
  }

  showAdminPermits(uuid: any): Observable<any> {
    return this.http.get<any>(`${this.Root_URL}/admin-permits/${uuid}`, { headers: this.getHeaders() });
  }

  showDepartmentApproval(uuid: any): Observable<any> {
    return this.http.get<any>(`${this.Root_URL}/department-approval/${uuid}`, { headers: this.getHeaders() });
  }

  patchDepartmentApproval(uuid: any, data: any): Observable<any> {
    return this.http.patch<any>(`${this.Root_URL}/department-approval/${uuid}`, data, { headers: this.getHeaders() });
  }
}
