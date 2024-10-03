import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class ReservePortfolioService {
  opts = {
    headers : {
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }
  }

  constructor(private http: HttpClient, private env: EnvService) { }

  getDT(){
    return this.http.get(`${this.env.apiUrl}/Trading/CurrentDateTime`, this.opts);
  }

  getUnitPerAccess(permissionID: number) {
    return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerAccess?permissionID=${permissionID}`, this.opts);
  }
  
  getReserveSchedules(){
    return this.http.get(`${this.env.apiUrl}/reservemarket/GetRegionalPortfolio`, this.opts);
  }

  getUnitRegion(){
    return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerRegion`, this.opts);
  }
  
  getRMRegionPrices24h(region) {
    return this.http.get(`${this.env.apiUrl}/reservemarket/GetRegionalReserveRSP?Region=${region}`, this.opts);
  }

  saveGeneralRemarks(data) {
    return this.http.post(`${this.env.apiUrl}/reservemarket/SaveGeneralRemarks`, data, this.opts);
  }
}
