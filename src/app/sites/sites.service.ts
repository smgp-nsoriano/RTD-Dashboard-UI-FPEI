import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class SitesService {
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

  getSites(companyId: number) {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetSite?CompanyID=${companyId}`, this.fetch_userToken());
  }

  deleteSite(siteID: number) {
    return this.http.delete(`${this.env.apiUrl}/Configuration/DeleteSite/${siteID}`, this.fetch_userToken());
  }

  createOrUpdateSite(SiteID: number, SiteName: string, SiteCode: string, Address: string, Region: string, FtpPath: string) {
    const data = {
      SiteID,
      SiteName,
      SiteCode,
      Address,
      Region,
      FtpPath
    };

    return this.http.post(`${this.env.apiUrl}/Configuration/CreateUpdateSite`, data, this.fetch_userToken());
  }
}
