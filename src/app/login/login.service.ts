import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
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

  validateuser(username, password) {
    const data = 'username=' + username + '&password=' + password + '&grant_type=password';
    const header = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded'});
    return this.http.post(`${this.env.apiUrl}/token`, data, {headers: header});
  }

  getCurrentUserInfo() {
    // return this.http.get(`${this.env.apiUrl}/UserManagement/GetCurrentUserInfoWithPermission`, this.opts);
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetCurrentUserInfoWithPermission`);
  }

  verifyOtp(sessionId:string,otp:string){
    const data = 'username=' + sessionId + '&password=' + otp + '&grant_type=password';
    const header = new HttpHeaders({'Content-Type' : 'application/x-www-form-urlencoded'});
    return this.http.post(`${this.env.apiUrl}/mfa-token`, data, {headers: header});
  }

  resendOtp(data){
    return this.http.post(`${this.env.apiUrl}/UserManagement/RequestOtp`, data);
  }
}
