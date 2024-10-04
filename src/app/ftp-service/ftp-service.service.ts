import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class FtpServiceService {
  opts = {
    headers : {
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }
  }

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getServiceList() {
    return this.http.get(`${this.env.apiUrl}/MarketMap/GetFtpServices`, this.opts);
  }

  CreateUpdateService(data){
    return this.http.post(`${this.env.apiUrl}/MarketMap/SaveFTPService`, data, this.opts);
  }

  DeleteService(ID){
    return this.http.delete(`${this.env.apiUrl}/MarketMap/DeleteFTPService/${+ID}`, this.opts);
  }
}
