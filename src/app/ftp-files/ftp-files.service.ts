import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class FtpFilesService {
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

  getFTPFiles(){
    return this.http.get(`${this.env.apiUrl}/MarketMap/GetFTPFiles`, this.fetch_userToken());
  }

  getFTPList() {
    return this.http.get(`${this.env.apiUrl}/MarketMap/GetFTPInfo`, this.fetch_userToken());
  }

  getServiceList() {
    return this.http.get(`${this.env.apiUrl}/MarketMap/GetFtpServices`, this.fetch_userToken());
  }

  
  SaveFiles(data){
    return this.http.post(`${this.env.apiUrl}/MarketMap/SaveFile`, data, this.fetch_userToken());
  }

  DeleteFile(ID){
    return this.http.delete(`${this.env.apiUrl}/MarketMap/DeleteFile/${+ID}`, this.fetch_userToken());
  }
}
