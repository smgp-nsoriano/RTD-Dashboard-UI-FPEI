import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getList() {
    return this.http.get(`${this.env.apiUrl}/Division/List?CompanyID=1`);
  }
}
