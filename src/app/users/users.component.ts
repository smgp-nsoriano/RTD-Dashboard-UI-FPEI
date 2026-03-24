import { Component, OnInit } from '@angular/core';
import { UsersService } from './users.service';
import { faEdit, faPlus, faCheck, faBan, faKey, faUnlockAlt, faTrash, faFileExcel, faSave } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  faEdit = faEdit;
  faPlus = faPlus;
  faCheck = faCheck;
  faTimes = faBan;
  faBan=faBan;
  faKey = faKey;
  faUnlock = faUnlockAlt;
  faTrash = faTrash;
  faFileExcel= faFileExcel;
  faSave = faSave;
  src:string;
  users;
  userList: Object;
  permissions;
  selectedUser = {};
  newUser;
  selectedPermission;
  isLoading=false;
  currentUserInfo;

  successMessage = null;

  modalTitle;
  selectedRec;
  isEdit: boolean;
  isDeleting: boolean;
  modalRef: NgbModalRef;
  form: FormGroup;
  accountType;

  alert = {
    type: null,
    message: null
  };

  constructor(
    private userServices: UsersService,
    private modalService: NgbModal,
    config: NgbModalConfig) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.form = new FormGroup({
      userName: new FormControl(),
      firstName: new FormControl(),
      lastName: new FormControl(),
      emailAddress: new FormControl(),
      accountType: new FormControl(),
      hasExpiration: new FormControl(),
    });

   // this.getCurrentUserInfo();
  }

  ngOnInit() {
    this.getUsers();
    this.getAccountType();
   // this.getCurrentUserInfo();
    // this.getUserList();

   /* this.userServices.getPermissions().subscribe(permissions => {
      this.permissions = permissions;
    }, error => {
      console.log(error.message);
    }); */
  }

  clearAlert() {
    this.alert.type = null;
    this.alert.message = null;
  }

  getAccountType() {
    this.userServices.getAccountType().subscribe(data => {
      this.accountType = data;
    }, error => {
      console.log(error.message);
    });
  }

  save() {
    this.isLoading = true;
    const payload = {
      UserName: this.form.get('userName').value,
      FirstName: this.form.get('firstName').value,
      LastName: this.form.get('lastName').value,
      EmailAddress: this.form.get('emailAddress').value,
      AccountTypeID: this.form.get('accountType').value,
      HasInactivityExpiration: this.form.get('hasExpiration').value,
      CreatedBy: 'Admin'
    };

    this.userServices.insertuser(payload).subscribe(data => {
      try {
        this.users.unshift(data[0]);
      } catch (error) {
        this.getUsers();
      }

      this.form.reset;

      this.alert.type = 'success';
      this.alert.message = 'Successfully saved!';
      this.isLoading = false;
      this.modalRef.close();
    }, error => {
      this.alert.type = 'danger';
      this.alert.message = error.error;
      this.isLoading = false;
    });
    
  }

  update(rec) {
    this.isLoading = true;
    const payload = {
      UserID: rec.UserID,
      UserName: this.form.get('userName').value,
      FirstName: this.form.get('firstName').value,
      LastName: this.form.get('lastName').value,
      EmailAddress: this.form.get('emailAddress').value,
      AccountTypeID: this.form.get('accountType').value,
      HasInactivityExpiration: this.form.get('hasExpiration').value,
      ModifiedBy: 'Admin'
    };

    this.userServices.updateuser(payload).subscribe(data => {
      Object.assign(this.selectedRec, data[0]);
     
      this.form.reset;

      this.alert.type = 'success';
      this.alert.message = 'Successfully updated!';
      this.isLoading = false;
      this.modalRef.close();
    }, error => {
      this.alert.type = 'danger';
      this.alert.message = error.error;
      this.isLoading = false;
    });
    
  }

  deleteuser(rec) {
    const index = this.users.indexOf(rec);

    this.userServices.deleteuser(rec).subscribe(data => {
      this.users.splice(index, 1);
      this.modalRef.close();
      this.alert.type = 'success';
      this.alert.message = 'Record deleted!';
    }, error => {
      console.log(error);
    });
  }

  resetpassword(rec) {
    this.userServices.resetpassword(rec).subscribe(data => {
      this.modalRef.close();
      this.alert.type = 'success';
      this.alert.message = 'Password successfully reset!';
    }, error => {
      console.log(error);
    });
  }

  unlockUser(rec){
    this.userServices.unlockAccount(rec.UserID).subscribe(data => {
      this.getUsers();
      this.modalRef.close();
      this.alert.type = 'success';
      this.alert.message = 'Account successfully unlocked!';
    }, error => {
      console.log(error);
    });
  }


  getUsers() {
    this.userServices.getUsers().subscribe(users => {
      console.log(users);
      
      this.users = users;
    }, error => {
      console.log(error.message);
    });
  }

  // getUserList() {
  //   this.userServices.getUserList().subscribe(users => {
  //     this.userList = users;
  //   }, error => {
  //     console.log(error.message);
  //   });
  // }

  modal(modal, editing: boolean, rec: null) {
    this.isLoading = false;
    if (editing) {
      this.modalTitle = 'Update Account';
      this.selectedRec = rec;
      this.isEdit = editing;

      this.form.get('userName').patchValue(this.selectedRec.UserName);
      this.form.get('firstName').patchValue(this.selectedRec.FirstName);
      this.form.get('lastName').patchValue(this.selectedRec.LastName);
      this.form.get('emailAddress').patchValue(this.selectedRec.EmailAddress);
      this.form.get('accountType').patchValue(this.selectedRec.UserTypeID);
      this.form.get('hasExpiration').patchValue(this.selectedRec.HasInactivityExpiration);
    } else {
      this.modalTitle = 'Create New Account';
      this.selectedRec = null;
      this.isEdit = editing;

      this.form.get('userName').patchValue(null);
      this.form.get('firstName').patchValue(null);
      this.form.get('lastName').patchValue(null);
      this.form.get('emailAddress').patchValue(null);
      this.form.get('accountType').patchValue(null);
      this.form.get('hasExpiration').patchValue(null);
    }
    this.modalRef = this.modalService.open(modal, { centered: true });
  }

  otherModal(modal, deleting: boolean, rec: null) {
    this.selectedRec = rec;
    this.isDeleting = deleting;
    this.modalRef = this.modalService.open(modal, { centered: true });
  }

  unlockModal(modal, rec: null) {
    this.selectedRec = rec;
    this.modalRef = this.modalService.open(modal, { centered: true });
  }

  selectPermission(event) {
    const selected = this.permissions.find(permission => permission.AccountTypeID === +event.target.value);

    this.selectedPermission = selected.AccountTypeID;
  }

  getCurrentUserInfo() {
    this.userServices.getCurrentUserInfo().subscribe(info => {
      localStorage.setItem('current_user', JSON.stringify(info));

      this.currentUserInfo = info;
    }, error => {
      console.log(error.message);
    });
  }

  disable_confirmation_open(modal, isDisable: boolean, rec: null) {
    this.isLoading = false;

    this.modalTitle = isDisable ? 'Deactivate User Account' : "Activate User Account";
    this.selectedRec = rec;
    // this.isEdit = editing;

    // this.form.get('userName').patchValue(this.selectedRec.UserName);
    // this.form.get('firstName').patchValue(this.selectedRec.FirstName);
    // this.form.get('lastName').patchValue(this.selectedRec.LastName);
    // this.form.get('emailAddress').patchValue(this.selectedRec.EmailAddress);
    // this.form.get('accountType').patchValue(this.selectedRec.UserTypeID);

    this.modalRef = this.modalService.open(modal, {centered:true});
  }

  disableuser(rec) {
    const index = this.users.indexOf(rec);

    this.userServices.disableuser(rec).subscribe(data => {
      // this.users.splice(index, 1);
      this.users[index].IsActive = false;
      this.modalRef.close();
      this.alert.type = 'success';
      this.alert.message = 'Record disabled!';
    }, error => {
      console.log(error);
    });
  }

  enableuser(rec) {
    const index = this.users.indexOf(rec);

    this.userServices.enableuser(rec).subscribe(data => {
      // this.users.splice(index, 1);
      this.users[index].IsActive = true;
      this.modalRef.close();
      this.alert.type = 'success';
      this.alert.message = 'Record enabled!';
    }, error => {
      console.log(error);
    });
  }

  exportToExcel(): void {
    const data = this.users.map(x => ({
      Username: x.UserName,
      Type: x.UserType,
      FullName: x.FirstName + ' ' + x.LastName,
      Email: x.EmailAddress,
      Status: x.Status,
      LastLoginDate: x.LastLoginDate,
      DeactivationDate: x.DateDisabled
    }));
  
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Users': worksheet },
      SheetNames: ['Users']
    };
  
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
  
    this.saveAsExcelFile(excelBuffer, 'UserList');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
  
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + '.xlsx');
  }
}
