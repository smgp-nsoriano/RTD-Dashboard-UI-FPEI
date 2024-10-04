import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  opts = {
    headers : {
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }
  }

  constructor(private http: HttpClient,
    private env: EnvService) { }

    
  getCurrentRTD(siteId: number, unitId: number) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetCurrentRTD?siteID=${siteId}&UnitID=${unitId}`, this.opts);
  }
  
  getDT(){
    return this.http.get(`${this.env.apiUrl}/Trading/CurrentDateTime`, this.opts);
  }

  getErrorMessage(siteId: number, unitId: number) {
    return this.http.get(`${this.env.apiUrl}/MarketData/ErrorMessage?siteID=${siteId}&UnitID=${unitId}`, this.opts);
  }

  getAheadRTD(siteId: number, unitId: number) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetAheadRTDDesc?siteID=${siteId}&UnitID=${unitId}`, this.opts);
  }

  getPastTime(siteId: number, unitId: number) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetPastRTDDesc?siteID=${siteId}&UnitID=${unitId}`, this.opts);
  }

  getSiteList(id: number) {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetSiteAccess?permissionID=${+id}`, this.opts);
  }

  getUnitList(siteId: number) {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetUnit?SiteID=${siteId}`, this.opts);
  }

  getOperatorUnit(id: number) {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetOperatorUnit?permissionID=${+id}`, this.opts);
  }

  getDAP(siteId: number, unitId: number, current: boolean) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetDAPExtended?SiteID=${siteId}&UnitID=${unitId}&IsCurrent=${current}`, this.opts);
    // return this.http.get('assets/data/day_interval.json');
  }

  getHAP(siteId: number, unitId: number) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetHAPExtended?SiteID=${siteId}&UnitID=${unitId}`, this.opts);
    // return this.http.get('assets/data/hap.json');
  }

  checkConnection(){
    return this.http.get(`${this.env.apiUrl}/Trading/Interval`, this.opts);
  }
}
