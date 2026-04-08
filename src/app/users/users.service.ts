import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
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

  getCurrentUserInfo() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetCurrentUserInfoWithPermission`);
  }

  changePassword(data) {
    return this.http.put(`${this.env.apiUrl}/UserManagement/ChangePassword/${data.userID}`, data);
  }

  changePasswordNew(data) {
    return this.http.put(`${this.env.apiUrl}/ChangePassword`, data);
  }

  getUsers() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetUserInfo`);
  }

  getAccountType() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetAccountTypeList`);
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
    return this.http.post(`${this.env.apiUrl}/UserManagement/Insert`, data);
  }

  updateuser(data) {
    return this.http.put(`${this.env.apiUrl}/UserManagement/Update/${data.UserID}`, data);
  }

  deleteuser(data) {
    return this.http.delete(`${this.env.apiUrl}/UserManagement/Delete/${data.UserID}`);
  }

  disableuser(data) {
    return this.http.get(`${this.env.apiUrl}/UserManagement/Disable/${data.UserID}`);
  }

  enableuser(data) {
    return this.http.get(`${this.env.apiUrl}/UserManagement/Enable/${data.UserID}`);
  }

  resetpassword(data) {
    return this.http.put(`${this.env.apiUrl}/UserManagement/ResetPassword/${data.UserID}`, data);
  }

  unlockAccount(id) {
    return this.http.put(`${this.env.apiUrl}/UserManagement/UnlockAccount/${id}`, null);
  }

  getCompanySetting() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetCompanySetting`);
  }

  saveCompanySetting(data) {
    return this.http.post(`${this.env.apiUrl}/UserManagement/SaveCompanySetting`, data);
  }

  decrypt(data) {
    return this.http.get(`${this.env.apiUrl}/UserManagement/Decrypt/${data}`);
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
    return this.http.post(`${this.env.apiUrl}/UserManagement/UserLogs`, data);
  }

  loginLogs(data){
    return this.http.post(`${this.env.apiUrl}/UserManagement/LoginLogs`, data);
  }
}
