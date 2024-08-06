import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';



@Injectable({
  providedIn: 'root'
})
export class TraderDashboardService {

  constructor(private http: HttpClient,
    private env: EnvService) { }

    getUnitList(siteId: number) {
      return this.http.get(`${this.env.apiUrl}/Configuration/GetAllUnit`);
    }

    getInterval(){
      return this.http.get(`${this.env.apiUrl}/Trading/Interval`);
    }

    getDT(){
      return this.http.get(`${this.env.apiUrl}/Trading/CurrentDateTime`);
    }

    getPrice(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/Price?UnitNumber=${unit}`);
    }
    
    getRTD(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/RTD?UnitNumber=${unit}`);
    }

    getReserveSchedules(unit:string){
      return this.http.get(`${this.env.apiUrl}/reservemarket/GetSchedule?UnitNumber=${unit}`);
    }

    getHAP(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetUnitHAP?UnitNumber=${unit}`);
    }

    getDAP(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetUnitDAP?UnitNumber=${unit}`);
    }

    getOverrideValue(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetOverrideValue?UnitNumber=${unit}`);
    }

    saveOverrideValue(data) {
      return this.http.post(`${this.env.apiUrl}/Trading/SaveOverrideValue`, data, {
        headers : {
          'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
      }});
    }

    getMOTValue(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetMOTValue?UnitNumber=${unit}`);
    }

    saveMOTValue(data) {
      return this.http.post(`${this.env.apiUrl}/Trading/SaveMOTValue`, data, {
        headers : {
          'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
      }});
    }
 

    getDemand(UnitNumber:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetDemand?UnitNumber=${UnitNumber}`);
    }

    getImportExport(){
      return this.http.get(`${this.env.apiUrl}/Trading/GetImportExport`);
    }

    getImportExport2(){
      return this.http.get(`${this.env.apiUrl}/Trading/GetImportExport2`);
    }


    getUnitRegion(){
      return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerRegion`);
    }

    getUnitPerAccess(permissionID:number){
      return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerAccess?permissionID=${permissionID}`);
    }

    getPBRemarks(unit:string,timestamp:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetRemarks?UnitNumber=${unit}&Timestamp=${timestamp}`);
    }

    saveRemarks(data) {
      return this.http.post(`${this.env.apiUrl}/Trading/SaveRemarks`, data, {
        headers : {
          'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
      }});
    }

    saveGeneralRemarks(data) {
      return this.http.post(`${this.env.apiUrl}/Trading/SaveGeneralRemarks`, data, {
        headers : {
          'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
      }});
    }

    getAllUnitDAP(){
      return this.http.get(`${this.env.apiUrl}/Trading/GetAllUnitDAP`);
    }




}
