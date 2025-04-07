import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class SRService {
  fetch_userToken(){
    return {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
      }
    }
  }
  
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getCurrentRTD(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetRTDPriceCurrentByUnit?Unit=${unit}`, this.fetch_userToken());
  }

  getAheadRTD(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetAheadRTDByUnit?Unit=${unit}`, this.fetch_userToken());
  }

  getPastTime(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetPastRTDByUnit?Unit=${unit}`, this.fetch_userToken());
  }

  getCurrentRTDH(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetRTDPriceCurrentByUnitHourly?Unit=${unit}`, this.fetch_userToken());
  }

  getAheadRTDH(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetAheadRTDByUnitHourly?Unit=${unit}`, this.fetch_userToken());
  }

  getPastTimeH(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetPastRTDByUnitHourly?Unit=${unit}`, this.fetch_userToken());
  }

  getUnitList() {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetUnit?SiteID=1002`, this.fetch_userToken());
  }

  getDT(){
    return this.http.get(`${this.env.apiUrl}/Trading/CurrentDateTime`, this.fetch_userToken());
  }
}
