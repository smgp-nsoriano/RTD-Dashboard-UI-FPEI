import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
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

  getCurrentUserInfo() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetCurrentUserInfoWithPermission`, this.fetch_userToken());
  }

  changePassword(data) {
    return this.http.put(`${this.env.apiUrl}/UserManagement/ChangePassword/${data.userID}`, data, this.fetch_userToken());
  }

  changePasswordNew(data) {
    return this.http.put(`${this.env.apiUrl}/ChangePassword`, data, this.fetch_userToken());
  }

  getUsers() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetUserInfo`, this.fetch_userToken());
  }

  getAccountType() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetAccountTypeList`, this.fetch_userToken());
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
    return this.http.post(`${this.env.apiUrl}/UserManagement/Insert`, data, this.fetch_userToken());
  }

  updateuser(data) {
    return this.http.put(`${this.env.apiUrl}/UserManagement/Update/${data.UserID}`, data, this.fetch_userToken());
  }

  deleteuser(data) {
    return this.http.delete(`${this.env.apiUrl}/UserManagement/Delete/${data.UserID}`, this.fetch_userToken());
  }

  disableuser(data) {
    return this.http.get(`${this.env.apiUrl}/UserManagement/Disable/${data.UserID}`, this.fetch_userToken());
  }

  enableuser(data) {
    return this.http.get(`${this.env.apiUrl}/UserManagement/Enable/${data.UserID}`, this.fetch_userToken());
  }

  resetpassword(data) {
    return this.http.put(`${this.env.apiUrl}/UserManagement/ResetPassword/${data.UserID}`, data, this.fetch_userToken());
  }

  unlockAccount(id) {
    return this.http.put(`${this.env.apiUrl}/UserManagement/UnlockAccount/${id}`, null, this.fetch_userToken());
  }

  getCompanySetting() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetCompanySetting`, this.fetch_userToken());
  }

  saveCompanySetting(data) {
    return this.http.post(`${this.env.apiUrl}/UserManagement/SaveCompanySetting`, data, this.fetch_userToken());
  }

  decrypt(data) {
    return this.http.get(`${this.env.apiUrl}/UserManagement/Decrypt/${data}`, this.fetch_userToken());
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
    return this.http.post(`${this.env.apiUrl}/UserManagement/UserLogs`, data, this.fetch_userToken());
  }

  loginLogs(data){
    return this.http.post(`${this.env.apiUrl}/UserManagement/LoginLogs`, data, this.fetch_userToken());
  }
}
