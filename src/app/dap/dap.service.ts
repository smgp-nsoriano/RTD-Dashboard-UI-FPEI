import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class DapService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  dapCsv(siteName: string) {
    return this.http.get(`${this.env.apiUrl}/RTD/SaveDAPCSV?siteName=${siteName}`, {
      withCredentials: true
    });
  }
}
