import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const token = localStorage.getItem('userToken');
        if (token) {
            return true;
        } else {
            this.router.navigate(['']);
        }
    }
}
