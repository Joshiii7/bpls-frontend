import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  constructor(private http: HttpClient) { }
  readonly Root_URL = 'http://localhost:8000/api';

  getHeaders(contentType?: string): HttpHeaders {
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
  
  login(data: any) {
    return this.http.post(`${this.Root_URL}/login`, data);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
