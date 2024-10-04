import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class FtpConfigService {
  opts = {
    headers : {
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }
  }
 
  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getFTPList() {
    return this.http.get(`${this.env.apiUrl}/MarketMap/GetFTPInfo`, this.opts);
  }

  CreateUpdateFTP(data){
    return this.http.post(`${this.env.apiUrl}/MarketMap/SaveFTPConfiguration`, data, this.opts);
  }

  DeleteFTP(ID){
    return this.http.delete(`${this.env.apiUrl}/MarketMap/DeleteFTPConfiguration/${+ID}`, this.opts);
  }
}
