import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class FtpFilesService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getFTPFiles(){
    return this.http.get(`${this.env.apiUrl}/MarketMap/GetFTPFiles`);
  }

  getFTPList() {
    return this.http.get(`${this.env.apiUrl}/MarketMap/GetFTPInfo`);
  }

  getServiceList() {
    return this.http.get(`${this.env.apiUrl}/MarketMap/GetFtpServices`);
  }

  
  SaveFiles(data){
    return this.http.post(`${this.env.apiUrl}/MarketMap/SaveFile`, data);
  }

  DeleteFile(ID){
    return this.http.delete(`${this.env.apiUrl}/MarketMap/DeleteFile/${+ID}`);
  }
}
