import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    if (req.url.includes('/token') || req.url.includes('/mfa-token')) {
      return next.handle(req);
    }

    const accessToken = this.authService.getAccessToken();
    //console.log('get access token', accessToken);
    let authReq = req;

    if (accessToken) {
      //console.log('INTERCEPTOR HIT:', req.url);
      authReq = this.addTokenHeader(req, accessToken);
    }

    return next.handle(authReq).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return this.handle401Error(authReq, next);
        }
        // ✅ just forward the original error correctly
        return throwError(() => err);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        tap(res => {
          // Access token updated in AuthService and localStorage
          this.refreshTokenSubject.next(this.authService.getAccessToken());
        }),
        switchMap(() => {
          this.isRefreshing = false;
          const token = this.authService.getAccessToken();
          return next.handle(this.addTokenHeader(request, token!));
        }),
        catchError(err => {
          this.isRefreshing = false;
          return throwError(() => err);
        })
      );
    } else {
      // Wait until refresh is completed
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => next.handle(this.addTokenHeader(request, token!)))
      );
    }
  }
}