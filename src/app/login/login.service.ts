import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  opts = {
    headers : {
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }
  }

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  validateuser(username, password) {
    const data = 'username=' + username + '&password=' + password + '&grant_type=password';
    const header = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded'});
    return this.http.post(`${this.env.apiUrl}/token`, data, {headers: header});
  }

  getCurrentUserInfo() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetCurrentUserInfoWithPermission`, this.opts);
  }

}
