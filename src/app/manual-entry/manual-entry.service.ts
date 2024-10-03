import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class ManualEntryService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getSites(id: any) {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetSiteAccess?PermissionID=${+id}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  getUnitList(siteId: number) {
    return this.http.get(`${this.env.apiUrl}/ManualEntry/GetUnit?SiteID=${siteId}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  dataEntry(data) {
    return this.http.post(`${this.env.apiUrl}/ManualEntry/RTDValue`, data, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }


}
