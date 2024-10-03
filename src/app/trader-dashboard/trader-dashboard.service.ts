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
      return this.http.get(`${this.env.apiUrl}/Trading/Interval`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
    }

    getDT(){
      return this.http.get(`${this.env.apiUrl}/Trading/CurrentDateTime`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
    }

    getPrice(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/Price?UnitNumber=${unit}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
    }
    
    getRTD(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/RTD?UnitNumber=${unit}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
    }

    getReserveSchedules(unit:string){
      return this.http.get(`${this.env.apiUrl}/reservemarket/GetSchedule?UnitNumber=${unit}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
    }

    getHAP(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetUnitHAP?UnitNumber=${unit}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
    }

    getDAP(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetUnitDAP?UnitNumber=${unit}`), {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }};
    }

    getOverrideValue(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetOverrideValue?UnitNumber=${unit}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
    }

    saveOverrideValue(data) {
      return this.http.post(`${this.env.apiUrl}/Trading/SaveOverrideValue`, data, {
        headers : {
          'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
      }});
    }

    getMOTValue(unit:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetMOTValue?UnitNumber=${unit}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
    }

    saveMOTValue(data) {
      return this.http.post(`${this.env.apiUrl}/Trading/SaveMOTValue`, data, {
        headers : {
          'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
      }});
    }
 

    getDemand(UnitNumber:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetDemand?UnitNumber=${UnitNumber}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
    }

    getImportExport(){
      return this.http.get(`${this.env.apiUrl}/Trading/GetImportExport`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
    }

    getImportExport2(){
      return this.http.get(`${this.env.apiUrl}/Trading/GetImportExport2`, {
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

    getUnitPerAccess(permissionID:number){
      return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerAccess?permissionID=${permissionID}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
    }

    getPBRemarks(unit:string,timestamp:string){
      return this.http.get(`${this.env.apiUrl}/Trading/GetRemarks?UnitNumber=${unit}&Timestamp=${timestamp}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
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
      return this.http.get(`${this.env.apiUrl}/Trading/GetAllUnitDAP`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
    }




}
