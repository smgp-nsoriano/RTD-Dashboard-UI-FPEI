import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class ReservePortfolioService {
  // fetch_userToken(){
  //   return {
  //     headers : {
  //       'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
  //     }
  //   }
  // }

  constructor(private http: HttpClient, private env: EnvService) { }

  getDT(){
    return this.http.get(`${this.env.apiUrl}/Trading/CurrentDateTime`);
  }

  getUnitPerAccess(permissionID: number) {
    return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerAccess?permissionID=${permissionID}`);
  }
  
  getReserveSchedules(){
    return this.http.get(`${this.env.apiUrl}/reservemarket/GetRegionalPortfolio`);
  }

  getUnitRegion(){
    return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerRegion`);
  }
  
  getRMRegionPrices24h(region) {
    return this.http.get(`${this.env.apiUrl}/reservemarket/GetRegionalReserveRSP?Region=${region}`);
  }

  saveGeneralRemarks(data) {
    return this.http.post(`${this.env.apiUrl}/reservemarket/SaveGeneralRemarks`, data);
  }
}
