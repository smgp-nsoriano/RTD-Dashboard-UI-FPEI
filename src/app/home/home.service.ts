import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
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

  sampleData(name: string) {
    return this.http.get('assets/data/' + name.toLowerCase() + '-c-hourly.json');
  }

  getIntraDay() {
    return this.http.get('assets/data/new-intraday.json');
  }

  getForecastInterval() {
    return this.http.get('assets/data/forecast_interval.json');
  }

  getCurrentInterval() {
    return this.http.get('assets/data/current_interval.json');
  }

  getPreviousInterval() {
    return this.http.get('assets/data/previous_interval.json');
  }

  getDayInterval() {
    return this.http.get('assets/data/day_interval.json');
  }

  getHourInterval() {
    return this.http.get('assets/data/hap.json');
  }

  getCurrentRTD(siteId: number, unitId: number) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetCurrentRTD?siteID=${siteId}&UnitID=${unitId}`, this.fetch_userToken());
  }

  getErrorMessage(siteId: number, unitId: number) {
    return this.http.get(`${this.env.apiUrl}/MarketData/ErrorMessage?siteID=${siteId}&UnitID=${unitId}`, this.fetch_userToken());
  }

  getAheadRTD(siteId: number, unitId: number) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetAheadRTD?siteID=${siteId}&UnitID=${unitId}`, this.fetch_userToken());
  }

  getPastTime(siteId: number, unitId: number) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetPastRTD?siteID=${siteId}&UnitID=${unitId}`, this.fetch_userToken());
  }

  getSiteList(id: number) {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetSiteAccess?permissionID=${+id}`, this.fetch_userToken());
  }

  getUnitList(siteId: number) {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetUnit?SiteID=${siteId}`, this.fetch_userToken());
  }

  getOperatorUnit(id: number) {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetOperatorUnit?permissionID=${+id}`, this.fetch_userToken());
  }

  getDAP(siteId: number, unitId: number, current: boolean) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetDAP?SiteID=${siteId}&UnitID=${unitId}&IsCurrent=${current}`, this.fetch_userToken());
    // return this.http.get('assets/data/day_interval.json');
  }

  getHAP(siteId: number, unitId: number) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetHAP?SiteID=${siteId}&UnitID=${unitId}`, this.fetch_userToken());
    // return this.http.get('assets/data/hap.json');
  }


}
