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

  getApplicantApplicationDetails(uuid: any): Observable<any> {
    return this.http.get<any>(`${this.Root_URL}/applicants-application/${uuid}`, { headers: this.getHeaders() });
  }

  submitApplicantApplication(payload: any): Observable<any> {
    return this.http.post<any>(`${this.Root_URL}/applicants-application`, payload, { headers: this.getHeaders() });
  }
  
  checkPhoneNumber(number: string): Observable<any> {
    return this.http.get<any>(`${this.Root_URL}/check-phone?number=${number}`, { headers: this.getHeaders() });
  }

  getProvinces(): Observable<any> {
    return this.http.get<any>('assets/address/province.json');
  }

  getCities(): Observable<any> {
    return this.http.get<any>('assets/address/city.json');
  }

  getBaranggays(): Observable<any> {
    return this.http.get<any>('assets/address/barangay.json');
  }
}
