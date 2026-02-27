import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const token = localStorage.getItem('userToken');
        const isNewUser = localStorage.getItem('IN');
        const isPasswordExpired = localStorage.getItem('IPE');
        if (token  && isNewUser !== 'true' && isPasswordExpired !== 'true') {
            return true;
        } else {
            this.router.navigate(['']);
        }
    }
}
