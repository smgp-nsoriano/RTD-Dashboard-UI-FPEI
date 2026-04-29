import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { fromEvent, merge, Subscription, timer } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IdleService implements OnDestroy {

  private idleTimeout = 30 * 60 * 1000; // 30 minutes

  private activitySubscription: Subscription = new Subscription();
  private timerSubscription: Subscription = new Subscription();

  private storageListener!: (event: StorageEvent) => void;

  private isWatching = false;

  constructor(
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  startWatching() {

    console.log('IdleService: startWatching called');

    if (this.authService.isOperator() === true || this.authService.isTvAccess() === true) {
      console.log('IdleService: skipped (operator/tv)');
      return;
    }

    if (this.isWatching) return;

    this.isWatching = true;

    // ✅ Clear previous logout flag
    localStorage.removeItem('logoutEvent');

    // ✅ REAL AUTH CHECK
    if (!this.authService.getAccessToken()) {
      this.forceLogout(false);
      return;
    }

    // ✅ Fix future timestamps on start
    const now = Date.now();
    const lastActivity = Number(localStorage.getItem('lastActivity') || 0);

    if (lastActivity > now) {
      //console.warn('IdleService: future timestamp detected, fixing...');
      localStorage.setItem('lastActivity', now.toString());
    }

    this.ngZone.runOutsideAngular(() => {

      const events = ['mousemove', 'click', 'keydown', 'scroll', 'touchstart'];

      this.activitySubscription = merge(
        ...events.map(e => fromEvent(document, e))
      ).subscribe(() => this.resetTimer(true));

      // ✅ cross-tab sync
      this.storageListener = (event: StorageEvent) => {

        if (event.key === 'logoutEvent') {
          this.forceLogout(false);
        }

        if (event.key === 'lastActivity') {
          this.resetTimer(false);
        }
      };

      window.addEventListener('storage', this.storageListener);

      // ✅ tab focus check
      window.addEventListener('focus', () => {
        this.ngZone.run(() => this.checkIdleAcrossTabs());
      });

      // ✅ tab return from background
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          this.ngZone.run(() => this.checkIdleAcrossTabs());
        }
      });

      this.resetTimer(true);
    });
  }

  stopWatching() {
    console.log('IdleService: stopWatching');

    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    if (this.storageListener) {
      window.removeEventListener('storage', this.storageListener);
    }

    this.isWatching = false;
  }

  private resetTimer(isFromUser: boolean) {

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    if (isFromUser) {
      const now = Date.now();
      localStorage.setItem('lastActivity', now.toString());
      //console.log('IdleService: activity detected → reset timer');
    }

    this.timerSubscription = timer(this.idleTimeout)
      .subscribe(() => {
        this.ngZone.run(() => this.checkIdleAcrossTabs());
      });
  }

  private checkIdleAcrossTabs() {

    if (this.authService.isOperator() === true || this.authService.isTvAccess() === true) {
      return;
    }

    if (!this.authService.getAccessToken()) {
      this.forceLogout(false);
      return;
    }

    const lastActivity = Number(localStorage.getItem('lastActivity') || 0);
    const now = Date.now();

    console.log('IdleService check:', {
      now: new Date(now),
      lastActivity: new Date(lastActivity),
      diffMs: now - lastActivity
    });

    // 🚨 FIX: handle future timestamps
    if (lastActivity > now) {
      //console.warn('IdleService: future timestamp detected during check, fixing...');
      localStorage.setItem('lastActivity', now.toString());
      return;
    }

    if (now - lastActivity >= this.idleTimeout) {
      //console.log('IdleService: timeout reached → logout');
      this.forceLogout(true);
    } else {
      this.resetTimer(false);
    }
  }

  private forceLogout(showAlert: boolean) {

    // 🔒 prevent duplicate logout across tabs
    if (localStorage.getItem('logoutEvent')) return;

    localStorage.setItem('logoutEvent', Date.now().toString());

    this.stopWatching();

    this.ngZone.run(() => {
      if (showAlert) {
        alert('Session expired due to inactivity');
      }
      this.authService.logout();
    });
  }

  ngOnDestroy() {
    this.stopWatching();
  }
}