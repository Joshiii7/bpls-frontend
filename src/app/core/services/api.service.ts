import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  protected readonly Root_URL = 'https://bisligcitybpls.com/public/api';
  protected readonly Base_URL = 'https://bisligcitybpls.com';

  constructor(protected http: HttpClient) {}

  protected getHeaders(contentType?: string): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });

    if (contentType) {
      headers = headers.set('Content-Type', contentType);
    }

    return headers;
  }

  getUserRole(): Observable<any> {
    return this.http.get<any>(`${this.Root_URL}/userRole`, { headers: this.getHeaders() });
  }

  public getToken(): string | null {
    return localStorage.getItem('t');
  }

  protected decodeToken(token: string): any {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
