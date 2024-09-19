
//handles the click event procedure of refresh button from Trader Dashboard to RM,RR,RP

import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})


export class EventService{
  private audio: HTMLAudioElement;
  constructor() {
    this.audio = new Audio();
  }

  playAudio(url: string) {
    if (!this.audio.paused) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.audio.src = url;
    this.audio.load();
    this.audio.play();
  }
  stopAudio() {
    if (!this.audio.paused) {
      this.audio.pause();
      this.audio.currentTime = 0;
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

  
  private ClickEnablingEvent = new Subject<void>();
  private ClickDisablingEvent = new Subject<void>();
  enablingAlarm(){
    this.ClickEnablingEvent.next();
  }

  getEnableClickEvent(){
    return this.ClickEnablingEvent.asObservable();
  }

  disablingAlarm(){
    this.ClickDisablingEvent.next();
  }
  getDisableClickEvent(){
    return this.ClickDisablingEvent.asObservable();
  }
}


