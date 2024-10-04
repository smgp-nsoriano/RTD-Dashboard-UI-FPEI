import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class FileSheetService {
  opts = {
    headers : {
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }
  }

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getSheetList(id) {
    return this.http.get(`${this.env.apiUrl}/MarketMap/GetFTPFileSheet/${id}`, this.opts);
  }

  saveSheet(data){
    return this.http.post(`${this.env.apiUrl}/MarketMap/SaveFileSheet`, data, this.opts);
  }

  deleteSheet(id){
    return this.http.delete(`${this.env.apiUrl}/MarketMap/DeleteFileSheet/${+id}`, this.opts);
  }
}
