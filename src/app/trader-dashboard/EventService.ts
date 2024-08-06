
//handles the click event procedure of refresh button from Trader Dashboard to RM,RR,RP

import { Injectable } from "@angular/core";
import { Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})


export class EventService{
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

}


