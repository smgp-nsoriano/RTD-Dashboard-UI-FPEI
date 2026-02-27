import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const token = localStorage.getItem('userToken');
    const allowChange = localStorage.getItem('allowChangePassword');
  
    if (token && allowChange === 'true') {
      localStorage.removeItem('allowChangePassword');
      return true;
    }
  
    // Redirect manually if not allowed
    this.router.navigate(['']);  // <-- cannot use UrlTree
    return false;
  }
}