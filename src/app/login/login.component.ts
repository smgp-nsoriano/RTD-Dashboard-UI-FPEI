import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {LoginService} from './login.service';
import { FormGroup, FormControl } from '@angular/forms';
import { UsersService } from '../users/users.service';
import { IdleService } from '../_guard/idle.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  currentUserInfo;
  isCam: boolean;
  form: FormGroup;
  password = 'password';
  isLoading: boolean;
  isHide:boolean;
  mfaSessionId:string;
  showMfa:boolean;
  otp:string;
  timeLeft: number = 300; // 5 minutes
  interval: any;
  resendCooldown:number = 0;
  cooldownInterval: any;

  alert = {
    type: null,
    message: null
  };

  constructor(
    private route: ActivatedRoute,
    private loginservice: LoginService,
    private userService: UsersService,
    private router: Router,
    private idleService:IdleService
  ) {
    this.form = new FormGroup({
      username: new FormControl('', { updateOn: 'blur' }),
      password: new FormControl('', { updateOn: 'blur' }),
      sel: new FormControl()
    });
  }

  ngOnInit() {
    this.isLoading = false;
    this.isHide = true;
  }

  
  clearAlert() {
    this.alert.type = null;
    this.alert.message = null;
  }

  loginuser() {
    this.isLoading = true;
    localStorage.clear();
    const payload = {
      username: this.form.get('username').value,
      password: this.form.get('password').value,
      sel: this.form.get('sel').value,
      grant_type: this.password
    };

    //if(appType.value=='-- Select Application --'){
      //this.alert.type = 'danger';
      //this.alert.message = 'Please Select Application Type';
      //this.isLoading = false;
    //}else{
      this.loginservice.validateuser(payload.username, payload.password).subscribe((data: any) => {
        this.isLoading = false;
        localStorage.setItem('userToken', data.access_token);
        localStorage.setItem('IsCam', 'false');
        this.changePassword();
        //this.getCurrentUserInfo();
        }, 
        (error) => {
          this.isLoading = false;


          this.alert.type = 'danger';
        
          if (error.error && typeof error.error === 'string') {
        
            // Extract first JSON object only
            const firstJson = error.error.substring(
              0,
              error.error.indexOf('}') + 1
            );
        
            try {
              const parsed = JSON.parse(firstJson);
              console.log('Parsed response:', parsed);

              //handle mfa here
              if (parsed.requiresMfa) {
                this.mfaSessionId = parsed.mfaSessionId;
                this.showMfa = true;
                this.startTimer();      // start 5-min countdown
                this.startResendCooldown(); // optional: start resend cooldown
                return; // ❗ stop here (do NOT treat as error)
              }
        

              this.alert.message =
                parsed.error_description ||
                parsed.error ||
                'Invalid login attempt';
            } catch {
              this.alert.message = 'Invalid login attempt';
            }
        
          } else {
            this.alert.message = 'Login failed. Please try again.';
          }
        
          console.log('Parsed error:', this.alert.message);
        }
        );
    //}
  }

  getCurrentUserInfo() {
    this.loginservice.getCurrentUserInfo().subscribe(info => {
      this.isLoading = false;
      this.currentUserInfo = info;
     
      // if(this.currentUserInfo.UserType.includes('AH-')){
      //   alert('Access denied: Invalid Account.');
      //   localStorage.clear(); // 🔥 remove token
      //   return;
      // }

      this.isCam = this.currentUserInfo.IsCamSetup;
        localStorage.setItem('PermissionID', this.currentUserInfo.PermissionID);
        localStorage.setItem('IsAlarmDisable', this.currentUserInfo.IsAlarmDisable);
        localStorage.setItem('IsOverride', this.currentUserInfo.IsOverride);
        localStorage.setItem('IsPortfolioOnly', this.currentUserInfo.IsPortfolioOnly); //change function to enabling portfolio
        localStorage.setItem('IsPbReason', this.currentUserInfo.IsPbReason);
        localStorage.setItem('IsShowBid', this.currentUserInfo.IsShowBid);
        localStorage.setItem('IsShowPrice', this.currentUserInfo.IsShowPrice);
        localStorage.setItem('UserID', this.currentUserInfo.UserID);
        //if(appType=='RTD Dashboard'){
        localStorage.setItem('IsCam', 'false');
        localStorage.setItem('IN',this.currentUserInfo.IsNew);
        localStorage.setItem('IPE',this.currentUserInfo.IsPasswordExpired);
        localStorage.setItem('isOperator', this.currentUserInfo.IsOperator);
        localStorage.setItem('isTvAccess', this.currentUserInfo.IsTvAccess);
        
        if(this.currentUserInfo.IsSPDC){
          this.router.navigate(['/spdc-monitoring']);
        }else{
          if(this.currentUserInfo.IsOperator){
            this.router.navigate(['/home']);
          }else{
            this.router.navigate(['/trading']);
          }
        }

      // Logs UserLogin
        this.userService.loginLogs({UserID: this.currentUserInfo.UserID, Action: 'In'}).subscribe();
      //}else if(appType=='CAMS Settings'){
      //  if(this.isCam == true ){
     //     localStorage.setItem('IsCam', 'true');
      //    this.router.navigate(['/ftphome']);
       // }else{
      //    this.alert.type = 'danger';
      //      this.alert.message = 'Account has no permission from the selected application.';
      //      this.isLoading = false;
     //   }
     // }
      //console.log(this.isCam);
    }, error => {
      // console.log(error.message);
    });
  }

  changePassword(){
    this.loginservice.getCurrentUserInfo().subscribe(info =>{
      this.currentUserInfo = info;
      if(this.currentUserInfo.IsNew){
        localStorage.setItem('allowChangePassword', 'true');
        this.router.navigate(['/change-password']);
        return;
      }
  
      if(this.currentUserInfo.IsPasswordExpired){
        localStorage.setItem('allowChangePassword', 'true');
        alert("Your password has expired. Please change your password.");
        this.router.navigate(['/change-password']);
        return;
      }
    });
  }

  startTimer() {
    this.timeLeft = 300;
  
    if (this.interval) {
      clearInterval(this.interval);
    }
  
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
  
        this.alert = {
          type: 'danger',
          message: 'OTP expired. Please request a new one.'
        };
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  startResendCooldown() {
    this.resendCooldown = 30;
  
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  
    this.cooldownInterval = setInterval(() => {
      if (this.resendCooldown > 0) {
        this.resendCooldown--;
      } else {
        clearInterval(this.cooldownInterval);
      }
    }, 1000);
  }

  resendOtp(){
    if (this.resendCooldown > 0) return;

    this.startTimer();
    this.startResendCooldown();
    
    let payload = {
      MfaSessionId:this.mfaSessionId
    };
    this.loginservice.resendOtp(payload).subscribe((data:any)=>{
      this.alert = {
        type: 'success',
        message: 'OTP resent successfully'
      };
    },
    (error)=> {
      this.alert.type = 'danger';
      this.alert.message = error;
    }
    );
  }

  verifyOtp(){
    if (!this.otp) {
      this.alert = { type: 'danger', message: 'Please enter OTP' };
      return;
    }
    this.isLoading = true;

    this.loginservice.verifyOtp(this.mfaSessionId,this.otp).subscribe((data:any)=>{
      localStorage.setItem('userToken', data.access_token);
      localStorage.setItem('rToken', data.refresh_token);
      localStorage.setItem('IsCam', 'false');
      setTimeout(() => {
        this.getCurrentUserInfo();
      }, 2000);
    }, 
    (error) => {
      this.isLoading = false;
      this.alert.type = 'danger';
    
      if (error.error && typeof error.error === 'string') {
    
        // Extract first JSON object only
        const firstJson = error.error.substring(
          0,
          error.error.indexOf('}') + 1
        );
    
        try {
          const parsed = JSON.parse(firstJson);
          this.alert.message =
            parsed.error_description ||
            parsed.error ||
            'Invalid login attempt';
        } catch {
          this.alert.message = 'Invalid OTP';
        }
    
      } else {
        this.alert.message = 'Login failed. Please try again.';
      }
    
      console.log('Parsed error:', this.alert.message);
    });
  }
}
