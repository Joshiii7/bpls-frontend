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
}
