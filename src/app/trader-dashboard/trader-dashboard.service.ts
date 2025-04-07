import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';



@Injectable({
  providedIn: 'root'
})
export class TraderDashboardService {
  fetch_userToken(){
    return {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
      }
    }
  }

  constructor(private http: HttpClient,
    private env: EnvService) { }

    getUnitList(siteId: number) {
      return this.http.get(`${this.env.apiUrl}/Configuration/GetAllUnit`, this.fetch_userToken());
    }

    getInterval(){
      return this.http.get(`${this.env.apiUrl}/Trading/Interval`, this.fetch_userToken());
    }

    getDT(){
      return this.http.get(`${this.env.apiUrl}/Trading/CurrentDateTime`, this.fetch_userToken());
    }

    getPrice(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/Price?UnitNumber=${unit}`, this.fetch_userToken());
    }
    
    getRTD(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/RTD?UnitNumber=${unit}`, this.fetch_userToken());
    }

    getReserveSchedules(unit:string){
      return this.http.get(`${this.env.apiUrl}/reservemarket/GetSchedule?UnitNumber=${unit}`, this.fetch_userToken());
    }

    getHAP(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetUnitHAP?UnitNumber=${unit}`, this.fetch_userToken());
    }

    getDAP(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetUnitDAP?UnitNumber=${unit}`, this.fetch_userToken());
    }

    getOverrideValue(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetOverrideValue?UnitNumber=${unit}`, this.fetch_userToken());
    }

    saveOverrideValue(data) {
      return this.http.post(`${this.env.apiUrl}/Trading/SaveOverrideValue`, data, this.fetch_userToken());
    }

    getMOTValue(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetMOTValue?UnitNumber=${unit}`, this.fetch_userToken());
    }

    saveMOTValue(data) {
      return this.http.post(`${this.env.apiUrl}/Trading/SaveMOTValue`, data, this.fetch_userToken());
    }
 

    getDemand(UnitNumber:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetDemand?UnitNumber=${UnitNumber}`, this.fetch_userToken());
    }
    getPortfolioDemand(UnitPortfolioNumber:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetDemand?UnitNumber=${UnitPortfolioNumber}`, this.fetch_userToken());
    }

    getImportExport(){
      return this.http.get(`${this.env.apiUrl}/Trading/GetImportExport`, this.fetch_userToken());
    }

    getImportExport2(){
      return this.http.get(`${this.env.apiUrl}/Trading/GetImportExport2`, this.fetch_userToken());
    }


    getUnitRegion(){
      return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerRegion`, this.fetch_userToken());
    }

    getUnitPerAccess(permissionID:number){
      return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerAccess?permissionID=${permissionID}`, this.fetch_userToken());
    }

    getPBRemarks(unit:string,timestamp:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetRemarks?UnitNumber=${unit}&Timestamp=${timestamp}`, this.fetch_userToken());
    }

    saveRemarks(data) {
      return this.http.post(`${this.env.apiUrl}/Trading/SaveRemarks`, data, this.fetch_userToken());
    }

    saveGeneralRemarks(data) {
      return this.http.post(`${this.env.apiUrl}/Trading/SaveGeneralRemarks`, data, this.fetch_userToken());
    }

    getAllUnitDAP(){
      return this.http.get(`${this.env.apiUrl}/Trading/GetAllUnitDAP`, this.fetch_userToken());
    }




}
