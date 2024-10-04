import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';



@Injectable({
  providedIn: 'root'
})
export class TraderDashboardService {
  opts = {
    headers : {
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }
  }

  constructor(private http: HttpClient,
    private env: EnvService) { }

    getUnitList(siteId: number) {
      return this.http.get(`${this.env.apiUrl}/Configuration/GetAllUnit`, this.opts);
    }

    getInterval(){
      return this.http.get(`${this.env.apiUrl}/Trading/Interval`, this.opts);
    }

    getDT(){
      return this.http.get(`${this.env.apiUrl}/Trading/CurrentDateTime`, this.opts);
    }

    getPrice(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/Price?UnitNumber=${unit}`, this.opts);
    }
    
    getRTD(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/RTD?UnitNumber=${unit}`, this.opts);
    }

    getReserveSchedules(unit:string){
      return this.http.get(`${this.env.apiUrl}/reservemarket/GetSchedule?UnitNumber=${unit}`, this.opts);
    }

    getHAP(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetUnitHAP?UnitNumber=${unit}`, this.opts);
    }

    getDAP(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetUnitDAP?UnitNumber=${unit}`, this.opts);
    }

    getOverrideValue(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetOverrideValue?UnitNumber=${unit}`, this.opts);
    }

    saveOverrideValue(data) {
      return this.http.post(`${this.env.apiUrl}/Trading/SaveOverrideValue`, data, this.opts);
    }

    getMOTValue(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetMOTValue?UnitNumber=${unit}`, this.opts);
    }

    saveMOTValue(data) {
      return this.http.post(`${this.env.apiUrl}/Trading/SaveMOTValue`, data, this.opts);
    }
 

    getDemand(UnitNumber:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetDemand?UnitNumber=${UnitNumber}`, this.opts);
    }

    getImportExport(){
      return this.http.get(`${this.env.apiUrl}/Trading/GetImportExport`, this.opts);
    }

    getImportExport2(){
      return this.http.get(`${this.env.apiUrl}/Trading/GetImportExport2`, this.opts);
    }


    getUnitRegion(){
      return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerRegion`, this.opts);
    }

    getUnitPerAccess(permissionID:number){
      return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerAccess?permissionID=${permissionID}`, this.opts);
    }

    getPBRemarks(unit:string,timestamp:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetRemarks?UnitNumber=${unit}&Timestamp=${timestamp}`, this.opts);
    }

    saveRemarks(data) {
      return this.http.post(`${this.env.apiUrl}/Trading/SaveRemarks`, data, this.opts);
    }

    saveGeneralRemarks(data) {
      return this.http.post(`${this.env.apiUrl}/Trading/SaveGeneralRemarks`, data, this.opts);
    }

    getAllUnitDAP(){
      return this.http.get(`${this.env.apiUrl}/Trading/GetAllUnitDAP`, this.opts);
    }




}
