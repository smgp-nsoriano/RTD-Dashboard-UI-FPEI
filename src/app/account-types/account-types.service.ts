import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class AccountTypesService {
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


  getsites(data) {
    return this.http.get(`${this.env.apiUrl}/AccountPermission/GetSites/${data.permissionId}/${data.accountTypeId}`, this.fetch_userToken());
  }

  getOperatorAccess(data) {
    return this.http.get(`${this.env.apiUrl}/AccountPermission/GetOperatorAccess/${data.permissionId}/${data.accountTypeId}`, this.fetch_userToken());
  }

  savePermission(data) {
    return this.http.post(`${this.env.apiUrl}/AccountPermission/SavePermission/${data.accountType}/${data.createdby}/${data.isOperator}`, data, this.fetch_userToken());
  }

  saveSite(data) {
    return this.http.post(`${this.env.apiUrl}/AccountPermission/SaveSite`, data, this.fetch_userToken());
  }

  saveOperatorSite(data) {
    return this.http.post(`${this.env.apiUrl}/AccountPermission/SaveSiteOperator`, data, this.fetch_userToken());
  }

  updateAccountType(data) {
    return this.http.put(`${this.env.apiUrl}/AccountPermission/UpdateAccountType`, data, this.fetch_userToken());
  }

  deleteAccountType(data) {
    return this.http.delete(`${this.env.apiUrl}/AccountPermission/DeleteAccountType/${data.accountTypeId}`, this.fetch_userToken());
  }

  getAccountTypes() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetAccountTypeList`, this.fetch_userToken());
  }

  getOperatorAccountTypes(isOperator) {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetOperatorAccountTypeList?isOperator=${isOperator}`, this.fetch_userToken());
  }

  // createAccountType(type: string, user: string) {
  //   return this.http.post(`${this.env.apiUrl}/Admin/AddAccountType`, {
  //     AccountType: type,
  //     UserName: user
  //   }, {
  //     withCredentials: true
  //   });
  // }

  // setAccountPermission(id: number, checked: boolean) {
  //   return this.http.post(`${this.env.apiUrl}/Admin/SetAccountTypePermission`, {
  //     AccountTypeID: id,
  //     IsShowPrice: checked
  //   }, {
  //     withCredentials: true
  //   });
  // }
}
