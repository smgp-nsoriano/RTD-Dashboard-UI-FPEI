import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class SystemDemandDashboardServiceService {
  // opts = {
  //   headers : {
  //     'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
  //   }
  // }

  constructor(private http: HttpClient, private env: EnvService) { }
  getUnitList(siteId: number) {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetAllUnit`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  getInterval(){
    return this.http.get(`${this.env.apiUrl}/Trading/Interval`);
  }


  getSystemPrice(unit:string){
    return this.http.get(`${this.env.apiUrl}/Trading/GetSystemDemand?UnitNumber=${unit}`);
  }

  getUnitPerAccess(permissionID:number){
    return this.http.get(`${this.env.apiUrl}/Trading/GetUnitPerAccess?permissionID=${permissionID}`);
  }


  getSysDemand(){
    return this.http.get(`${this.env.apiUrl}/Trading/GetSystemDemand`);
  }

  getDT(){
    return this.http.get(`${this.env.apiUrl}/Trading/CurrentDateTime`);
  }

  getPrice(unit:string){
    return this.http.get(`${this.env.apiUrl}/Trading/Price?UnitNumber=${unit}`);
  }
}
