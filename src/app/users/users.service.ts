import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getCurrentUserInfo() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetCurrentUserInfoWithPermission`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  changePassword(data) {
    return this.http.put(`${this.env.apiUrl}/UserManagement/ChangePassword/${data.userID}`, data, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  getUsers() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetUserInfo`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  getAccountType() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetAccountTypeList`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  // getUserList() {
  //   return this.http.get(`${this.env.apiUrl}/UserManagement/GetUserList`, {
  //     withCredentials: true
  //   });
  // }

  getPermissions() {
    return this.http.get(`${this.env.apiUrl}/Admin/GetAccountTypeAndPermission`, {
      withCredentials: true
    });
  }

  insertuser(data) {
    return this.http.post(`${this.env.apiUrl}/UserManagement/Insert`, data, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  updateuser(data) {
    return this.http.put(`${this.env.apiUrl}/UserManagement/Update/${data.UserID}`, data, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  deleteuser(data) {
    return this.http.delete(`${this.env.apiUrl}/UserManagement/Delete/${data.UserID}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  disableuser(data) {
    return this.http.get(`${this.env.apiUrl}/UserManagement/Disable/${data.UserID}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  enableuser(data) {
    return this.http.get(`${this.env.apiUrl}/UserManagement/Enable/${data.UserID}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  resetpassword(data) {
    return this.http.put(`${this.env.apiUrl}/UserManagement/ResetPassword/${data.UserID}`, data, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  getCompanySetting() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetCompanySetting`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  saveCompanySetting(data) {
    return this.http.post(`${this.env.apiUrl}/UserManagement/SaveCompanySetting`, data, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  decrypt(data) {
    return this.http.get(`${this.env.apiUrl}/UserManagement/Decrypt/${data}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  updateUser(user: string, type: number) {
    return this.http.post(`${this.env.apiUrl}/Admin/SetAccountType`, {
      Username: user,
      AccountTypeID: type
    }, {
      withCredentials: true
    });
  }

  userLogs(data){
    return this.http.post(`${this.env.apiUrl}/UserManagement/UserLogs`, data, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  loginLogs(data){
    return this.http.post(`${this.env.apiUrl}/UserManagement/LoginLogs`, data, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }
}
