import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class ReserveMarketDashboardServiceService {
  opts = {
    headers : {
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }
  }

  constructor(private http: HttpClient, private env: EnvService) { }

  getDT(){
    return this.http.get(`${this.env.apiUrl}/Trading/CurrentDateTime`, this.opts);
  }

  getUnitPerAccess(permissionID:number){
    return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerAccess?permissionID=${permissionID}`, this.opts);
  }

  getInterval(){
    return this.http.get(`${this.env.apiUrl}/Trading/Interval`, this.opts);
  }

  getReserveSchedules(unit:string){
    return this.http.get(`${this.env.apiUrl}/reservemarket/GetSchedule?UnitNumber=${unit}`, this.opts);
  }

  getRMRegionPrices(region) {
    return this.http.get(`${this.env.apiUrl}/reservemarket/GetRegionalPrices?Region=${region}`, this.opts);
  }

  // helper for overriding
  getOverrideValue(unit:string){
    return this.http.get(`${this.env.apiUrl}/Trading/GetOverrideValue?UnitNumber=${unit}`, this.opts);
  }
  // post request for override value
  saveOverrideValue(data) {
    return this.http.post(`${this.env.apiUrl}/Trading/SaveOverrideValue`, data, this.opts);
  }
}
