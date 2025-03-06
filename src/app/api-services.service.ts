import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServicesService {

  constructor(private http: HttpClient) { }
  readonly Root_URL = 'http://localhost:8000/api';
  readonly Base_URL = 'http://localhost:8000';
  // readonly Root_URL = 'https://bisligcitybpls.com/public/api';
  // readonly Base_URL = 'https://bisligcitybpls.com';

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

  loginGoogle(userData: any) {
    return this.http.post(`${this.Root_URL}/googleLogin`, userData);
  }
  
  register(data: any) {
    return this.http.post(`${this.Root_URL}/register`, data);
  }

  updateStatus(id: number, data: any): Observable<any> {
    return this.http.put(`${this.Root_URL}/updateStatus/${id}`, data, { headers: this.getHeaders() });
  }

  logout() {
    return this.http.post(`${this.Root_URL}/logout`, {}, { headers: this.getHeaders() });
  }

  getUserRole() {
    return this.http.get(`${this.Root_URL}/userRole`, { headers: this.getHeaders() });
  }
  
  getBusinessType() {
    return this.http.get(`${this.Root_URL}/businessType`, { headers: this.getHeaders() });
  }

  checkNumber(number: any) {
    return this.http.post(`${this.Root_URL}/checkNumber/`, {number}, { headers: this.getHeaders() });
  }

  checkEmail(email: any) {
    return this.http.post(`${this.Root_URL}/checkEmail/`, {email}, { headers: this.getHeaders() });
  }

  declineApplication(id: any) {
    return this.http.post(`${this.Root_URL}/declineApplication/${id}`, {}, { headers: this.getHeaders() });
  }

  approveApplication(id: any) {
    return this.http.post(`${this.Root_URL}/approveApplication/${id}`, {}, { headers: this.getHeaders() });
  }

  getApplications() {
    return this.http.get(`${this.Root_URL}/myApplications`, { headers: this.getHeaders() });
  }

  allBusiness() {
    return this.http.get(`${this.Root_URL}/allBusiness`, { headers: this.getHeaders() });
  }

  getBusinesses(page: number = 1, perPage: number = 5): Observable<any> {
    return this.http.get<any>(`${this.Root_URL}/businesses?page=${page}&per_page=${perPage}`, { headers: this.getHeaders() });
  }

  searchBusinesses(search: any): Observable<any> {
    return this.http.get<any>(`${this.Root_URL}/searchBusinesses?search=${search}`, { headers: this.getHeaders() });
  }

  applicationDetail(id: any) {
    return this.http.get(`${this.Root_URL}/applicationDetail/${id}`, { headers: this.getHeaders() });
  }

  getProvinces() {
    return this.http.get(`${this.Root_URL}/provinces`, { headers: this.getHeaders() });
  }

  getCities(data: any) {
    return this.http.get(`${this.Root_URL}/cities/${data}`, { headers: this.getHeaders() });
  }

  getBarangays(data: any) {
    return this.http.get(`${this.Root_URL}/barangays/${data}`, { headers: this.getHeaders() });
  }

  businessStore(data: any) {
    return this.http.post(`${this.Root_URL}/businessStore`, data, { headers: this.getHeaders() });
  }

  getToken(): string | null {
    return localStorage.getItem('t');
  }

  // getUserRoles(): string {
  //   const token = this.getToken();
  //   if (token) {
  //     const decodedToken = this.decodeToken(token);
  //     return decodedToken.role;
  //   }
  //   return '';
  // }

  private decodeToken(token: string): any {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
