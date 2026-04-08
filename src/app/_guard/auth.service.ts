import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { EnvService } from '../env.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  accessToken:string;
  refreshTokenValue:string;

  constructor(private http: HttpClient,
    private env: EnvService) { }

  redirectUrl: string;
  refreshToken(): Observable<any> {
    const rToken = localStorage.getItem('rToken');
    if (!rToken) throw new Error('No refresh token available');

    const data = `refresh_token=${encodeURIComponent(rToken)}&grant_type=refresh_token`;
    const header = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post(`${this.env.apiUrl}/mfa-token`, data, { headers: header }).pipe(
      tap((res: any) => {
        // ✅ Update access token
        if (res.access_token) this.setAccessToken(res.access_token);

        // ✅ Update refresh token if returned
        if (res.refresh_token) this.setRefreshToken(res.refresh_token);
      })
    );
  }

   setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('userToken', token); // keep in localStorage
  }

  setRefreshToken(token: string) {
    this.refreshTokenValue = token;
    localStorage.setItem('rToken', token); // keep in localStorage
  }

  getAccessToken(): string | null {
    return this.accessToken || localStorage.getItem('userToken');
  }

  isOperator(): boolean {
    return JSON.parse(localStorage.getItem('isOperator') || 'false');
  }
  
  logout() {
    localStorage.clear();
    window.location.href = '';
  }
}
