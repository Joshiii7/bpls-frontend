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
}
