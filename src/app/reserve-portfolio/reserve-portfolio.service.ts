import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class ReservePortfolioService {

  constructor(private http: HttpClient, private env: EnvService) { }

  getUnitPerAccess(permissionID: number) {
    return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerAccess?permissionID=${permissionID}`);
  }
}
