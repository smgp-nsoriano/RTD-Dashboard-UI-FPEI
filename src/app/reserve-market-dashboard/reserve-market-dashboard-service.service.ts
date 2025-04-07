import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class ReserveMarketDashboardServiceService {
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

  getUnitPerAccess(permissionID:number){
    return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerAccess?permissionID=${permissionID}`, this.fetch_userToken());
  }

  getInterval(){
    return this.http.get(`${this.env.apiUrl}/Trading/Interval`, this.fetch_userToken());
  }

  getReserveSchedules(unit:string){
    return this.http.get(`${this.env.apiUrl}/reservemarket/GetSchedule?UnitNumber=${unit}`, this.fetch_userToken());
  }

  getRMRegionPrices(region) {
    return this.http.get(`${this.env.apiUrl}/reservemarket/GetRegionalPrices?Region=${region}`, this.fetch_userToken());
  }

  // helper for overriding
  getOverrideValue(unit:string){
    return this.http.get(`${this.env.apiUrl}/Trading/GetOverrideValue?UnitNumber=${unit}`, this.fetch_userToken());
  }
  // post request for override value
  saveOverrideValue(data) {
    return this.http.post(`${this.env.apiUrl}/Trading/SaveOverrideValue`, data, this.fetch_userToken());
  }
}
