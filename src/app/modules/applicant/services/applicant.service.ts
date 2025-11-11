import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicantService extends ApiService {

  getApplications(): Observable<any> {
    return this.http.get<any>(`${this.Root_URL}/applicants-application`, { headers: this.getHeaders() });
  }

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.Root_URL}/applicants-profile`, { headers: this.getHeaders() });
  }

  patchUserProfile(data: any, id: any): Observable<any> {
    return this.http.patch<any>(`${this.Root_URL}/applicants-profile/${id}`, data, { headers: this.getHeaders() });
  }

  getProvinces(): Observable<any> {
    return this.http.get<any>(`${this.Root_URL}/provinces`, { headers: this.getHeaders() });
  }

  getCities(province: any): Observable<any> {
    return this.http.get<any>(`${this.Root_URL}/cities/${province}`, { headers: this.getHeaders() });
  }

  getBaranggays(cities: any): Observable<any> {
    return this.http.get<any>(`${this.Root_URL}/barangays/${cities}`, { headers: this.getHeaders() });
  }
}
