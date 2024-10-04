import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class SRService {
  opts = {
    headers : {
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }
  }
  
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getCurrentRTD(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetRTDPriceCurrentByUnit?Unit=${unit}`, this.opts);
  }

  getAheadRTD(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetAheadRTDByUnit?Unit=${unit}`, this.opts);
  }

  getPastTime(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetPastRTDByUnit?Unit=${unit}`, this.opts);
  }

  getCurrentRTDH(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetRTDPriceCurrentByUnitHourly?Unit=${unit}`, this.opts);
  }

  getAheadRTDH(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetAheadRTDByUnitHourly?Unit=${unit}`, this.opts);
  }

  getPastTimeH(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetPastRTDByUnitHourly?Unit=${unit}`, this.opts);
  }

  getUnitList() {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetUnit?SiteID=1002`, this.opts);
  }

  getDT(){
    return this.http.get(`${this.env.apiUrl}/Trading/CurrentDateTime`, this.opts);
  }
}
