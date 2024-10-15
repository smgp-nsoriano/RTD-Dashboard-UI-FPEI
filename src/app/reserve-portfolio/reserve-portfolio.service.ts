import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class ReservePortfolioService {
  fetch_userToken(){
    return {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
      }
    }
  }

  constructor(private http: HttpClient, private env: EnvService) { }

  getDT(){
    return this.http.get(`${this.env.apiUrl}/Trading/CurrentDateTime`, this.fetch_userToken());
  }

  getUnitPerAccess(permissionID: number) {
    return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerAccess?permissionID=${permissionID}`, this.fetch_userToken());
  }
  
  getReserveSchedules(){
    return this.http.get(`${this.env.apiUrl}/reservemarket/GetRegionalPortfolio`, this.fetch_userToken());
  }

  getUnitRegion(){
    return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerRegion`, this.fetch_userToken());
  }
  
  getRMRegionPrices24h(region) {
    return this.http.get(`${this.env.apiUrl}/reservemarket/GetRegionalReserveRSP?Region=${region}`, this.fetch_userToken());
  }

  saveGeneralRemarks(data) {
    return this.http.post(`${this.env.apiUrl}/reservemarket/SaveGeneralRemarks`, data, this.fetch_userToken());
  }
}
