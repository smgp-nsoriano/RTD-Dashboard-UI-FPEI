import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from 'src/app/users/users.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  form: FormGroup;
  isLoading = false;
  isHide = true;

  alert = {
    type: null,
    message: null
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService:UsersService
  ) {
    this.form = new FormGroup(
      {
        newPassword: new FormControl('', [
          Validators.required,
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
        ]),
        confirmPassword: new FormControl('', Validators.required)
      },
      this.passwordMatchValidator
    );
  }

  ngOnInit() { }

  // ✅ Password Match Validator
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('newPassword').value;
    const confirm = group.get('confirmPassword').value;

    if (password !== confirm) {
      return { passwordMismatch: true };
    }

    return null;
  }

  // ✅ Submit Handler
  onSubmit() {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(field => {
        this.form.get(field).markAsTouched({ onlySelf: true });
      });
      return;
    }
  
    this.isLoading = true;
  
    const payload = {
      newPassword: this.form.value.newPassword,
      currentPassword: 'currentPassword', // replace with actual if needed
      confirmPassword: this.form.value.confirmPassword
    };
  
    // ✅ Use object syntax for subscribe
    this.usersService.changePasswordNew(payload).subscribe({
      next: (data) => {
        this.isLoading = false;
        alert("Your password has been successfully changed. Please log in with your new password.");
        localStorage.clear();
        this.router.navigate(['']); // redirect to login page
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
  
        let msg = "Something went wrong. Please try again.";
  
        // Handle status 400 with backend message
        if (err.status === 400 && err.error) {
          if (typeof err.error === "string") {
            msg = err.error;
          } else if ((err.error as any).message) {
            msg = (err.error as any).message;
          }
        }
  
        alert(msg);
      }
    });
  }

  hasUppercase(value: string): boolean {
    return /[A-Z]/.test(value);
  }
  
  hasLowercase(value: string): boolean {
    return /[a-z]/.test(value);
  }
  
  hasNumber(value: string): boolean {
    return /\d/.test(value);
  }
  
  hasSpecialChar(value: string): boolean {
    return /[\W_]/.test(value);
  }

  checkNewUser(): boolean {
    const isNewUser = localStorage.getItem('IN');
    return isNewUser === 'true'; // returns true or false
  }
}