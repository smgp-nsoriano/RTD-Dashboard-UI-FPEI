import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class AccountTypesService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }


  getsites(data) {
    return this.http.get(`${this.env.apiUrl}/AccountPermission/GetSites/${data.permissionId}/${data.accountTypeId}`);
  }

  getOperatorAccess(data) {
    return this.http.get(`${this.env.apiUrl}/AccountPermission/GetOperatorAccess/${data.permissionId}/${data.accountTypeId}`);
  }

  savePermission(data) {
    return this.http.post(`${this.env.apiUrl}/AccountPermission/SavePermission/${data.accountType}/${data.createdby}/${data.isOperator}`, data);
  }

  saveSite(data) {
    return this.http.post(`${this.env.apiUrl}/AccountPermission/SaveSite`, data);
  }

  saveOperatorSite(data) {
    return this.http.post(`${this.env.apiUrl}/AccountPermission/SaveSiteOperator`, data);
  }

  updateAccountType(data) {
    return this.http.put(`${this.env.apiUrl}/AccountPermission/UpdateAccountType`, data);
  }

  deleteAccountType(data) {
    return this.http.delete(`${this.env.apiUrl}/AccountPermission/DeleteAccountType/${data.accountTypeId}`);
  }

  getAccountTypes() {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetAccountTypeList`);
  }

  getOperatorAccountTypes(isOperator) {
    return this.http.get(`${this.env.apiUrl}/UserManagement/GetOperatorAccountTypeList?isOperator=${isOperator}`);
  }

  createAccountType(type: string, user: string) {
    return this.http.post(`${this.env.apiUrl}/Admin/AddAccountType`, {
      AccountType: type,
      UserName: user
    }, {
      withCredentials: true
    });
  }

  setAccountPermission(id: number, checked: boolean) {
    return this.http.post(`${this.env.apiUrl}/Admin/SetAccountTypePermission`, {
      AccountTypeID: id,
      IsShowPrice: checked
    }, {
      withCredentials: true
    });
  }
}
