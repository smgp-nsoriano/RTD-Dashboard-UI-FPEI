import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { interval, Observable, observable } from 'rxjs';
import { faCog, faUserCircle, faList, faSignOutAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { UsersService } from 'src/app/users/users.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { formControlBinding } from '@angular/forms/src/directives/ng_model';
import { NgbModalRef, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { IdleService } from 'src/app/_guard/idle.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isLoading:boolean;
  currentPlant = 'MASINLOC POWER PARTNERS CO. Ltd';
  isCollapsed = true;
  now = moment().format('MMMM DD, YYYY HH:mm:ss');
  IsCam: boolean;
  faCog = faCog;
  faUserCircle = faUserCircle;
  faList = faList;
  faSignOutAlt = faSignOutAlt;
  faSpinner = faSpinner;
  navShow:boolean;

  currentUserInfo;
  form: FormGroup;
  modalRef: NgbModalRef;
  isOperator:boolean;

  companySetting;
  formCompanySetting: FormGroup;
  password;
  alert = {
    type: null,
    message: null
  };

  constructor(private userServices: UsersService,
    private router: Router,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private idleService:IdleService) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.form = new FormGroup({
      currentPassword: new FormControl(),
      newPassword: new FormControl(),
      confirmPassword: new FormControl()
    });

    this.formCompanySetting = new FormGroup({
      CompanyName: new FormControl(),
      EmailAddress: new FormControl(),
      Password: new FormControl(),
      HostName: new FormControl(),
      Port: new FormControl()
    });

    this.getCurrentUserInfo();

    // this.currentUserInfo = JSON.parse(localStorage.getItem('current_user'));
  }

  ngOnInit() {
    this.navShow = false;
    if(localStorage.getItem('IsCam') =='true'){
      this.IsCam = true;
    }else{
      this.IsCam =false;
    }

    setTimeout(() => {
      this.idleService.startWatching();
    }, 3000);
    
    //interval(1000).subscribe(() => {
    //  this.now = moment().format('MMMM DD, YYYY HH:mm:ss');
   // });
  }

  changePlant(plant: string) {
    this.currentPlant = plant;
  }

  getCurrentUserInfo() {
    this.isLoading = true;
    this.userServices.getCurrentUserInfo().subscribe(info => {
      this.currentUserInfo = info;
      localStorage.setItem('currentUserName',this.currentUserInfo.UserName);
      localStorage.setItem('isOperator', this.currentUserInfo.IsOperator);
      localStorage.setItem('isTvAccess', this.currentUserInfo.IsTvAccess);
      localStorage.setItem('permissionID', this.currentUserInfo.PermissionID);
      localStorage.setItem('isSPDC', this.currentUserInfo.IsSPDC);
      this.isLoading = false;
      this.isOperator = this.currentUserInfo.IsOperator;
    }, error => {
      this.isLoading = false;
      //console.log(error.message);
      window.alert('Session has expired! Please re-login.');
      this.router.navigate(['']);
    });
  }

  openNav(){
    this.navShow = true;
  }
  closeNav(){
    this.navShow = false;
  }
  ucFirst(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  logout() {
    // Logs UserLogin
    this.userServices.loginLogs({UserID: this.currentUserInfo.UserID, Action: 'Out'}).subscribe(data =>{});
    localStorage.clear();
    this.idleService.stopWatching();
  }

  goToChangePassword(){
    localStorage.setItem('allowChangePassword', 'true');
    this.router.navigate(['/change-password']);
  }

  changePassword() {
    const payload = {
      currentPassword: this.form.get('currentPassword').value,
      newPassword: this.form.get('newPassword').value,
      confirmPassword: this.form.get('confirmPassword').value,
      userID: this.currentUserInfo.UserID
    };
    //console.log(payload);
    this.userServices.changePassword(payload).subscribe(data => {
      this.modalRef.close();
    }, error => {
      this.alert.type = 'danger';
      this.alert.message = error.error;
    });
  }

  clearAlert() {
    this.alert.type = null;
    this.alert.message = null;
  }

  decrypt(str) {
      this.userServices.decrypt(str).subscribe(data => {
        this.formCompanySetting.get('Password').patchValue(data);
      });
  }

  getCompanySetting() {
    this.userServices.getCompanySetting().subscribe(data => {
      this.companySetting = data[0];
      this.formCompanySetting.get('CompanyName').patchValue(this.companySetting.CompanyName);
      this.formCompanySetting.get('EmailAddress').patchValue(this.companySetting.EmailAddress);
      this.decrypt(this.companySetting.Password);
      this.formCompanySetting.get('HostName').patchValue(this.companySetting.HostName);
      this.formCompanySetting.get('Port').patchValue(this.companySetting.Port);

    }, error => {
      console.log(error.error);
    });
  }

  saveCompanySetting() {
    const payload = {
      CompanyName: this.formCompanySetting.get('CompanyName').value,
      EmailAddress: this.formCompanySetting.get('EmailAddress').value,
      Password: this.formCompanySetting.get('Password').value,
      HostName: this.formCompanySetting.get('HostName').value,
      Port: this.formCompanySetting.get('Port').value,
      CreatedBy: 'Admin'
    };

    this.userServices.saveCompanySetting(payload).subscribe(data => {
      this.formCompanySetting.reset();
      this.modalRef.close();
    }, error => {
      this.alert.type = 'danger';
      this.alert.message = error.error;
    });
  }

  modal(modal) {
    this.clearAlert();
    this.form.get('currentPassword').patchValue(null);
    this.form.get('newPassword').patchValue(null);
    this.form.get('confirmPassword').patchValue(null);
    this.modalRef = this.modalService.open(modal);
  }

  modalCompanySetting(modal) {
    this.clearAlert();
    this.getCompanySetting();
    this.modalRef = this.modalService.open(modal);
  }
}
