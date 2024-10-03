
//handles the click event procedure of refresh button from Trader Dashboard to RM,RR,RP

import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})


export class EventService{
  private audio: HTMLAudioElement;
  stopaudio(){
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }
  playAudio(url: string) {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.audio = new Audio(url);
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
      }).catch(error => {
        //console.error('Error playing audio:', error);
      });

    }
  }

  private ClickEvent = new Subject<void>();
  Refresh(){
    this.ClickEvent.next();
  }
  getClickEvent(){
    return this.ClickEvent.asObservable();
  }
  RefreshPortfolio(){
    this.ClickEvent.next();
  }
  getPortfolioClickEvent(){
    return this.ClickEvent.asObservable();
  }

    
  private enablingAlarmClickEvent = new Subject<void>();
  private disablingAlarmClickEvent = new Subject<void>();
  enableAlarm(){
    this.enablingAlarmClickEvent.next();
  }
  getenablingAlarmClickEvent(){
    return this.enablingAlarmClickEvent.asObservable();
  }

  disableAlarm(){
    this.disablingAlarmClickEvent.next();
  }
  getdisablingAlarmClickEvent(){
    return this.disablingAlarmClickEvent.asObservable();
  }

  private storage: any = {};

  setItem(key: string, value: any) {
    this.storage[key] = value;
  }
  getItem(key: string): any {
    return this.storage[key];
  }


}


