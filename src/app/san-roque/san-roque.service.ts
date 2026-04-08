import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class SRService {
  // fetch_userToken(){
  //   return {
  //     headers : {
  //       'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
  //     }
  //   }
  // }
  
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getCurrentRTD(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetRTDPriceCurrentByUnit?Unit=${unit}`);
  }

  getAheadRTD(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetAheadRTDByUnit?Unit=${unit}`);
  }

  getPastTime(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetPastRTDByUnit?Unit=${unit}`);
  }

  getCurrentRTDH(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetRTDPriceCurrentByUnitHourly?Unit=${unit}`);
  }

  getAheadRTDH(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetAheadRTDByUnitHourly?Unit=${unit}`);
  }

  getPastTimeH(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetPastRTDByUnitHourly?Unit=${unit}`);
  }

  getUnitList() {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetUnit?SiteID=1002`);
  }

  getDT(){
    return this.http.get(`${this.env.apiUrl}/Trading/CurrentDateTime`);
  }
}
