import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class ReservePortfolioService {

  constructor(private http: HttpClient, private env: EnvService) { }

  getDT(){
    return this.http.get(`${this.env.apiUrl}/Trading/CurrentDateTime`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  getUnitPerAccess(permissionID: number) {
    return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerAccess?permissionID=${permissionID}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }
  
  getReserveSchedules(){
    return this.http.get(`${this.env.apiUrl}/reservemarket/GetRegionalPortfolio`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  getUnitRegion(){
    return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerRegion`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }
  
  getRMRegionPrices24h(region) {
    return this.http.get(`${this.env.apiUrl}/reservemarket/GetRegionalReserveRSP?Region=${region}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  saveGeneralRemarks(data) {
    return this.http.post(`${this.env.apiUrl}/reservemarket/SaveGeneralRemarks`, data, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }
}
