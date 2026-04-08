import { Injectable, NgZone } from '@angular/core';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleTimeout = 15 * 60 * 1000; // 15 minutes

  private activitySubscription!: Subscription;
  private timerSubscription!: Subscription;

  private isWatching = false;

  constructor(
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  startWatching() {
      // ✅ skip if operator
      if (this.authService.isOperator()) {
        return;
      }
  

    // ✅ prevent multiple initialization
    if (this.isWatching) return;
    this.isWatching = true;

  
    this.ngZone.runOutsideAngular(() => {
      const events = [
        'mousemove',
        'click',
        'keydown',
        'scroll',
        'touchstart'
      ];

      const activity$ = merge(
        ...events.map(event => fromEvent(document, event))
      );

      // ✅ USER activity (real activity)
      this.activitySubscription = activity$.subscribe(() => {
        this.resetTimer(true);
      });

      // ✅ SYNC activity across tabs
      window.addEventListener('storage', (event) => {
        if (event.key === 'lastActivity') {
          this.resetTimer(false); // do NOT rebroadcast
        }

        if (event.key === 'logoutEvent') {
          this.authService.logout();
        }
      });

      // ✅ initialize timer
      this.resetTimer(true);
    });
  }

  stopWatching() {
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }
    
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.isWatching = false;
  }

  private resetTimer(isFromUser: boolean) {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    // ✅ broadcast ONLY if real user activity
    if (isFromUser) {
      localStorage.setItem('lastActivity', Date.now().toString());
    }

    this.timerSubscription = timer(this.idleTimeout).subscribe(() => {
      this.checkIdleAcrossTabs();
    });
  }

  private checkIdleAcrossTabs() {
    if (this.authService.isOperator()) {
      return; // operators never logged out
    }
    const lastActivity = Number(localStorage.getItem('lastActivity') || 0);
    const now = Date.now();

    if (now - lastActivity >= this.idleTimeout) {
      this.logout();
    } else {
      // another tab is still active
      this.resetTimer(false);
    }
  }

  private logout() {
    // ✅ stop everything FIRST
    this.stopWatching();

    // ✅ notify all tabs
    localStorage.setItem('logoutEvent', Date.now().toString());

    this.ngZone.run(() => {
      alert('Session expired due to inactivity');
      this.authService.logout();
    });
  }
}