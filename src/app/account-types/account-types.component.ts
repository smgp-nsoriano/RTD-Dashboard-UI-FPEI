import { Component, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { AccountTypesService } from './account-types.service';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../users/users.service';
import { objectEach } from 'highcharts';
import { FormGroup, FormControl } from '@angular/forms';
import { element } from 'protractor';

@Component({
  selector: 'app-account-types',
  templateUrl: './account-types.component.html',
  styleUrls: ['./account-types.component.scss']
})
export class AccountTypesComponent implements OnInit {
  faPlus = faPlus;
  types;
  operatorTypes;
  accountType;
  sites;
  permissions;
  selectedpermision;
  form: FormGroup;
  selectedRec;
  modalReference: NgbModalRef;
  isEditing: boolean;
  successMessage = null;
  modalTitle:string;
  isOperator:boolean;
  isLoading= false;

  alert = {
    type: null,
    message: null
  };

  alertOperator = {
    type: null,
    message: null
  };



  constructor(
    private userServices: UsersService,
    private typeServices: AccountTypesService,
    private modalService: NgbModal,
    config: NgbModalConfig) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.form = new FormGroup({
      accountType: new FormControl(),
      accountTypeId: new FormControl(),
      permissionId: new FormControl()
    });
  }

  ngOnInit() {
    this.getAccountTypes(0);
    this.getAccountTypes(1);
  }

  getsite(id: number, accountTid: number) {
    const payload = {
      permissionId: id,
      accountTypeId: accountTid
    };

    this.typeServices.getsites(payload).subscribe(data => {
      this.sites = data;
    }, error => {
      console.log(error.error);
    });
  }


  getOperatorAccess(id: number, accountTid: number) {
    const payload = {
      permissionId: id,
      accountTypeId: accountTid
    };

    this.typeServices.getOperatorAccess(payload).subscribe(data => {
      this.sites = data;
      //console.log(this.sites, payload);
    }, error => {
      console.log(error.error);
    });
  }

  clearAlert() {
    this.alert.type = null;
    this.alert.message = null;
    this.alertOperator.type = null;
    this.alertOperator.message = null;
  }

  savepermission(rec) {
      const record = rec;
      this.isLoading = true;
      let permissionId: any;
      let isTag: boolean;
      const payload = {
        accountType: this.form.get('accountType').value,
        createdby: 'Admin',
        isOperator: this.isOperator
      };

      record.forEach(element => {
        if(element.Tag){
          isTag = true;
        }
      });

      if(payload.accountType == null){
        if(this.isOperator==true){
          this.alertOperator.type = 'warning';
          this.alertOperator.message = 'Please input account type.'
        }else{
          this.alert.type = 'warning';
          this.alert.message = 'Please input account type.'
        }
        this.isLoading = false;
        return;
      }

      if(!isTag){
        if(this.isOperator==true){
          this.alertOperator.type = 'warning';
          this.alertOperator.message = 'Please select permission.'
        }else{
          this.alert.type = 'warning';
          this.alert.message = 'Please select permission.'
        }
        this.isLoading = false;
         return;
      }
      
      this.typeServices.savePermission(payload).subscribe(data => {
        permissionId = data;
        
        record.forEach(element => {
          const payloadsite = {
            permissionId: permissionId,
            siteId: element.SiteID,
            accessid: element.AccessID,
            config: element.Config,
            tag: element.Tag,
            isSite: element.IsSite
          };

          if(this.isOperator==true){
            this.typeServices.saveOperatorSite(payloadsite).subscribe(dt =>{
              this.alertOperator.type = 'success';
              this.alertOperator.message = 'Successfully saved!';
              this.getAccountTypes(1);
            });
            
          }else{
            this.typeServices.saveSite(payloadsite).subscribe(dt => {
              this.getAccountTypes(0);
              this.alert.type = 'success';
              this.alert.message = 'Successfully saved!';
            });
          }
          this.isLoading = false;
          this.modalReference.close();
        });
      });
  }

  updatePermission(rec) {
    this.isLoading=true;
    const record = rec;
    let isTag: boolean;
    const payload = {
      accounttype: this.form.get('accountType').value,
      accounttypeid: this.form.get('accountTypeId').value,
      modifiedby: 'Admin'
    };

    record.forEach(element => {
      if(element.Tag){
        isTag = true;
      }
    });

    if(payload.accounttype == null || payload.accounttype ==""){
      if(this.isOperator==true){
        this.alertOperator.type = 'warning';
        this.alertOperator.message = 'Please input account type.'
      }else{
        this.alert.type = 'warning';
        this.alert.message = 'Please input account type.'
      }
      this.isLoading = false;
      return;
    }

    if(!isTag){
      if(this.isOperator==true){
        this.alertOperator.type = 'warning';
        this.alertOperator.message = 'Please select permission.'
      }else{
        this.alert.type = 'warning';
        this.alert.message = 'Please select permission.'
      }
      this.isLoading = false;
       return;
    }
    

    this.typeServices.updateAccountType(payload).subscribe();

    record.forEach(element => {
      
      const payloadsite = {
        permissionId: this.form.get('permissionId').value,
        siteId: element.SiteID,
        accessid: element.AccessID,
        config: element.Config,
        tag: element.Tag,
        isSite: element.IsSite
      };
      if(this.isOperator){
        this.typeServices.saveOperatorSite(payloadsite).subscribe(data =>{
          this.alertOperator.type = 'success';
          this.alertOperator.message = 'Successfully updated!';
          this.getAccountTypes(1);
        });
        
      }else{
        this.typeServices.saveSite(payloadsite).subscribe(data =>{
          this.getAccountTypes(0);
          this.alert.type = 'success';
          this.alert.message = 'Successfully updated!';
        });
        
      }
      this.isLoading = false;
      this.modalReference.close();

    });
  }

  deleteAccountType(rec) {
    const payload = {
      accountTypeId: rec.AccountTypeID
    };

    this.typeServices.deleteAccountType(payload).subscribe(data => {
      
      this.modalReference.close();

      if(this.isOperator){
        this.alertOperator.type = 'success';
        this.alertOperator.message = 'Successfully deleted!';
        this.getAccountTypes(1);
      }else{
        this.getAccountTypes(0);
        this.alert.type = 'success';
        this.alert.message = 'Successfully deleted!';
      }
      
    });
  }

  tagpermission(index) {
    this.sites[index].Tag = !this.sites[index].Tag;
  }

  tagOperatorPermission(rec,sites){
    rec.Tag = !rec.Tag
    sites.forEach(element => {
      if(element.SiteName != rec.SiteName && rec.Config == null){
        if(element.Config == null){
          element.Tag = false;
        }
      }
    });
  }
  

  openModal(content: NgbModal, isEditing: boolean, id: number, account: number, accountid: number, IsOperator:any, title:string) {
    this.modalTitle = title;
    this.isOperator = IsOperator;
    this.isLoading = false;

    this.clearAlert();
    if(IsOperator){
      this.getOperatorAccess(id, accountid);
    }else{
      this.getsite(id, accountid);
    }
    
    this.isEditing = isEditing;
    this.form.get('accountType').patchValue(account);
    this.form.get('accountTypeId').patchValue(accountid);
    this.form.get('permissionId').patchValue(id);
    this.modalReference = this.modalService.open(content, {size: 'lg'});
  }

  otherModal(modal, rec: null, IsOperator:any) {
    this.isOperator = IsOperator;
    this.selectedRec = rec;
    this.modalReference = this.modalService.open(modal);
  }

  getAccountTypes(IsOperator) {
    this.typeServices.getOperatorAccountTypes(IsOperator).subscribe(types => {
      if(IsOperator == 0){
        this.types = types;
      }else{
        this.operatorTypes = types;
        //console.log(this.types);
      }
      
    }, error => {
      console.log(error.message);
    });
  }

  createAccountType() {
    const user = JSON.parse(localStorage.getItem('current_user'));

    this.typeServices.createAccountType(this.accountType, user.UserName).subscribe(data => {
      //this.getAccountTypes();

      this.successMessage = 'Successfuly saved.';

      this.modalReference.close();
    }, error => {
      console.log(error.message);
    });
  }

  updatePrice(event, type) {
    const checked = event.target.checked;

    this.typeServices.setAccountPermission(type.AccountTypeID, checked).subscribe(data => {
     // this.getAccountTypes();
      this.successMessage = 'Successfully saved';
      this.getCurrentUserInfo();
    }, error => {
      console.log(error.message);
    });
  }

  getCurrentUserInfo() {
    this.userServices.getCurrentUserInfo().subscribe(info => {
      localStorage.setItem('current_user', JSON.stringify(info));
    });
  }
}
