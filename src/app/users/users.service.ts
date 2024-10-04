import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  opts = {
    headers : {
      'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }
  }

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getCurrentUserInfo() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetCurrentUserInfoWithPermission`, this.opts);
  }

  changePassword(data) {
    return this.http.put(`${this.env.apiUrl}/UserManagement/ChangePassword/${data.userID}`, data, this.opts);
  }

  getUsers() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetUserInfo`, this.opts);
  }

  getAccountType() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetAccountTypeList`, this.opts);
  }

  // getUserList() {
  //   return this.http.get(`${this.env.apiUrl}/UserManagement/GetUserList`, {
  //     withCredentials: true
  //   });
  // }

  // getPermissions() {
  //   return this.http.get(`${this.env.apiUrl}/Admin/GetAccountTypeAndPermission`, {
  //     withCredentials: true
  //   });
  // }

  insertuser(data) {
    return this.http.post(`${this.env.apiUrl}/UserManagement/Insert`, data, this.opts);
  }

  updateuser(data) {
    return this.http.put(`${this.env.apiUrl}/UserManagement/Update/${data.UserID}`, data, this.opts);
  }

  deleteuser(data) {
    return this.http.delete(`${this.env.apiUrl}/UserManagement/Delete/${data.UserID}`, this.opts);
  }

  disableuser(data) {
    return this.http.get(`${this.env.apiUrl}/UserManagement/Disable/${data.UserID}`, this.opts);
  }

  enableuser(data) {
    return this.http.get(`${this.env.apiUrl}/UserManagement/Enable/${data.UserID}`, this.opts);
  }

  resetpassword(data) {
    return this.http.put(`${this.env.apiUrl}/UserManagement/ResetPassword/${data.UserID}`, data, this.opts);
  }

  getCompanySetting() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetCompanySetting`, this.opts);
  }

  saveCompanySetting(data) {
    return this.http.post(`${this.env.apiUrl}/UserManagement/SaveCompanySetting`, data, this.opts);
  }

  decrypt(data) {
    return this.http.get(`${this.env.apiUrl}/UserManagement/Decrypt/${data}`, this.opts);
  }

  // updateUser(user: string, type: number) {
  //   return this.http.post(`${this.env.apiUrl}/Admin/SetAccountType`, {
  //     Username: user,
  //     AccountTypeID: type
  //   }, {
  //     withCredentials: true
  //   });
  // }

  userLogs(data){
    return this.http.post(`${this.env.apiUrl}/UserManagement/UserLogs`, data, this.opts);
  }

  loginLogs(data){
    return this.http.post(`${this.env.apiUrl}/UserManagement/LoginLogs`, data, this.opts);
  }
}
