import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class WebListService {
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

  getList() {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetWebServiceURLList`, this.fetch_userToken());
  }

  updateWebService(WebID, URL, Type) {
    const data = { WebID, URL, Type };

    return this.http.post(`${this.env.apiUrl}/Configuration/UpdateWebUrl`, data, this.fetch_userToken());
  }
}
