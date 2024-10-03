import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class SRService {
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getCurrentRTD(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetRTDPriceCurrentByUnit?Unit=${unit}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  getAheadRTD(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetAheadRTDByUnit?Unit=${unit}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  getPastTime(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetPastRTDByUnit?Unit=${unit}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  getCurrentRTDH(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetRTDPriceCurrentByUnitHourly?Unit=${unit}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  getAheadRTDH(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetAheadRTDByUnitHourly?Unit=${unit}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  getPastTimeH(unit: string) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetPastRTDByUnitHourly?Unit=${unit}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  getUnitList() {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetUnit?SiteID=1002`);
  }

  getDT(){
    return this.http.get(`${this.env.apiUrl}/Trading/CurrentDateTime`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }
}
