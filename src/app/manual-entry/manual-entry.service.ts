import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class ManualEntryService {
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

  getSites(id: any) {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetSiteAccess?PermissionID=${+id}`);
  }

  getUnitList(siteId: number) {
    return this.http.get(`${this.env.apiUrl}/ManualEntry/GetUnit?SiteID=${siteId}`);
  }

  dataEntry(data) {
    return this.http.post(`${this.env.apiUrl}/ManualEntry/RTDValue`, data);
  }


}
