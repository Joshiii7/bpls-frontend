import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService  {
  
  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.Root_URL}/login`, data);
  }

  loginGoogle(data: any): Observable<any> {
    return this.http.post<any>(`${this.Root_URL}/googleLogin`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.Root_URL}/register`, data);
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.Root_URL}/logout`, {}, { headers: this.getHeaders() });
  }
}
