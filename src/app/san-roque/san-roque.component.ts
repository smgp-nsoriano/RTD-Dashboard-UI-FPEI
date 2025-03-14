import { Component, OnInit, OnDestroy } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';

import { SRService } from './san-roque.service';
import * as moment from 'moment';
import { interval, Subject } from 'rxjs';
import { UsersService } from '../users/users.service';
import { faRetweet } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-san-roque',
  templateUrl: './san-roque.component.html',
  styleUrls: ['./san-roque.component.scss']
})
export class SanRoqueComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<any> = new Subject();
  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
  now:any;
  faRetweet = faRetweet;

  unit1: string;
  unit2: string;
  unit3: string;

  unit1BColor: string;
  unit2BColor: string;
  unit3BColor: string;

  unit1FColor: string;
  unit2FColor: string;
  unit3FColor: string;

  units;

  unit1CurrentRTD;
  unit2CurrentRTD;
  unit3CurrentRTD;

  unit1AheadRTD;
  unit2AheadRTD;
  unit3AheadRTD;

  unit1PastRTD;
  unit2PastRTD;
  unit3PastRTD;


  unit1CurrentRTDH;
  unit2CurrentRTDH;
  unit3CurrentRTDH;

  unit1AheadRTDH;
  unit2AheadRTDH;
  unit3AheadRTDH;

  unit1PastRTDH;
  unit2PastRTDH;
  unit3PastRTDH;

  currentUserInfo;
  alarmOutsideLimit:boolean;
  alarmNoconnection:boolean;
  alarmRTDChanged:boolean;
  alarmHAP:boolean;
  alarmOverride:boolean;
  timerAlarmOutsideLimit:any;
  timerAlarmHAP:any;
  timerAlarmOverride:any;
  timerAlarmRTD:any;
  timerClock: any;
  timerData: any;
  alertMessage:string;
  
  blinkerTimer1:any;
  blinkerTimer2:any;
  blinkerTimer3:any;
  isRTDBlinking1:boolean;
  isRTDBlinking2:boolean;
  isRTDBlinking3:boolean;

  constructor(
    private srService: SRService
    , private userService: UsersService
  ) {
    this.getCurrentUserInfo();
  }

  ngOnInit() {
    this.bodyTag.classList.add('bg-dark');
    this.now = moment("","MM/DD/YYYY HH:mm:ss");
    this.unit1 = '01SROQUE_U01';
    this.unit2 = '01SROQUE_U02';
    this.unit3 = '01SROQUE_U03';
    this.DefaultValue();
    this.getUnits();
    this.getData();
    this.getDataHourly();
    this.SetTimeFromServer();
    interval(15000)
    .subscribe(() => {
      this.SetTimeFromServer();
    });
  }
  
  DefaultValue(){
    this.units=[];

    this.unit1CurrentRTD=[];
    this.unit2CurrentRTD=[];
    this.unit3CurrentRTD=[];

    this.unit1AheadRTD=[];
    this.unit2AheadRTD=[];
    this.unit3AheadRTD=[];

    this.unit1PastRTD=[];
    this.unit2PastRTD=[];
    this.unit3PastRTD=[];


    this.unit1CurrentRTDH=[];
    this.unit2CurrentRTDH=[];
    this.unit3CurrentRTDH=[];

    this.unit1AheadRTDH=[];
    this.unit2AheadRTDH=[];
    this.unit3AheadRTDH=[];

    this.unit1PastRTDH=[];
    this.unit2PastRTDH=[];
    this.unit3PastRTDH=[];
  }

  FormatClock(){
    return this.now.format('MMMM DD, YYYY HH:mm:ss');
  }

  timerSetClock(dt:string){
    this.now = moment(dt,"MM/DD/YYYY HH:mm:ss");
    this.timerClock = setInterval(() => {
      this.now.add(1, 'second');
    }, 1000);
  }

  SetTimeFromServer(){
    this.srService.getDT().subscribe(data=>{
      clearInterval(this.timerData);
      clearInterval(this.timerClock);
      this.timerSetClock(data.toString());
      this.timerGetData();
    });
  }

  ManualRefresh(){
    this.SetTimeFromServer();
    this.getData();
    this.getDataHourly();
  }

  timerGetData(){
    this.timerData = setInterval(() => {
      if(+moment(this.now).second() == 4){
        this.getData();
        this.getDataHourly();
      }

      if(+moment(this.now).second() == 10){
        if(this.alarmOutsideLimit == true){
          this.alertMessage = "Actual MW, outside the limits";
          this.OutsideLimitAudio();
          this.timerAlarmOutsideLimit = setInterval(() => {
            this.alertMessage = null;
            clearInterval(this.timerAlarmOutsideLimit);
          },5000);
        }
      }

      if(+moment(this.now).minute() % 5 == 0){
        if(+moment(this.now).second() == 7){
          if(this.alarmOverride == true){
            this.alertMessage = "Override value is in use";
            this.OverrideAudio();
            this.timerAlarmOverride = setInterval(() => {
              this.alertMessage = null;
              clearInterval(this.timerAlarmOverride);
            },5000);
          }

          if(this.alarmHAP == true){
            this.alertMessage = "HAP is in use";
            this.HAPAudio();
            this.timerAlarmHAP = setInterval(() => {
              this.alertMessage = null;
              clearInterval(this.timerAlarmHAP);
            },5000);
          }
          if(this.alarmNoconnection == true){
            this.alertMessage = "Connection to server problem";
          }

    
          let unit1Changed = false;
          let unit2Changed = false;
          let unit3Changed = false;
          
          // Check for changes in unit 1
          if ((this.unit1CurrentRTD['RTDValue'] != null && this.unit1PastRTD[0]['RTDValue'] != null)) {
            if (   this.unit1CurrentRTD['RTDValue'] != this.unit1PastRTD[0]['RTDValue']) {
              unit1Changed = true;
              this.blinkerTimer1 = setInterval(() => {
                if (+moment(this.now).second() % 2 === 1) {
                  this.isRTDBlinking1 = true;
                } else {
                  this.isRTDBlinking1 = false;
                }
              }, 1000);
            } else {
              clearInterval(this.blinkerTimer1);
              this.isRTDBlinking1 = false;
            }
          }
          
          // Check for changes in unit 2
          if (
            (this.unit2CurrentRTD['RTDValue'] != null && this.unit2PastRTD[0]['RTDValue'] != null)) {
            if (this.unit2CurrentRTD['RTDValue'] !== this.unit2PastRTD[0]['RTDValue']) {
              unit2Changed = true;
              this.blinkerTimer2 = setInterval(() => {
                if (+moment(this.now).second() % 2 === 1) {
                  this.isRTDBlinking2 = true;
                } else {
                  this.isRTDBlinking2 = false;
                }
              }, 1000);
            } else {
              clearInterval(this.blinkerTimer2);
              this.isRTDBlinking2 = false;
            }
          }
          
          // Check for changes in unit 3
          
          if ((this.unit3CurrentRTD['RTDValue'] != null && this.unit3PastRTD[0]['RTDValue'] != null)) {
            if (this.unit3CurrentRTD['RTDValue'] !== this.unit3PastRTD[0]['RTDValue']) {
              unit3Changed = true;
              this.blinkerTimer3 = setInterval(() => {
                if (+moment(this.now).second() % 2 === 1) {
                  this.isRTDBlinking3 = true;
                } else {
                  this.isRTDBlinking3 = false;
                }
              }, 1000);
            } else {
              clearInterval(this.blinkerTimer3);
              this.isRTDBlinking3 = false;
            }
          }
          
          // Trigger audio and reset after any change
          if (unit1Changed || unit2Changed || unit3Changed) {
            this.alertMessage = "RTD has changed!";
            this.RTDChangedAudio();
            // Reset blinking and other timers
            this.timerAlarmRTD = setInterval(() => {
              this.isRTDBlinking1 = false;
              this.isRTDBlinking2 = false;
              this.isRTDBlinking3 = false;
              this.alertMessage = null;
              clearInterval(this.blinkerTimer1);
              clearInterval(this.blinkerTimer2);
              clearInterval(this.blinkerTimer3);
              clearInterval(this.timerAlarmRTD);
            }, 60000);
          }
          


          
        }
      }


  }, 1000);
  }

  getUnits(){
    this.srService.getUnitList().subscribe(data=> {
      this.unit1BColor = data[0].BColor;
      this.unit2BColor = data[1].BColor;
      this.unit3BColor = data[2].BColor;

      this.unit1FColor = data[0].FColor;
      this.unit2FColor = data[1].FColor;
      this.unit3FColor = data[2].FColor;

    });
  }

  getDataHourly() {
    // Get Current RTD and EAP Data
    this.srService.getCurrentRTDH(this.unit1).subscribe(data => {
      this.unit1CurrentRTDH = data;
    }, error => {
      //console.log(error.message);
    });

    this.srService.getCurrentRTDH(this.unit2).subscribe(data => {
      this.unit2CurrentRTDH = data;
    }, error => {
      //console.log(error.message);
    });

    this.srService.getCurrentRTDH(this.unit3).subscribe(data => {
      this.unit3CurrentRTDH = data;
    }, error => {
      //console.log(error.message);
    });

    // Get Ahead RTDH and EAP Data
    this.srService.getAheadRTDH(this.unit1).subscribe(data => {
      this.unit1AheadRTDH = data;
    }, error => {
      //console.log(error.message);
    });

    this.srService.getAheadRTDH(this.unit2).subscribe(data => {
      this.unit2AheadRTDH = data;
    }, error => {
      //console.log(error.message);
    });

    this.srService.getAheadRTDH(this.unit3).subscribe(data => {
      this.unit3AheadRTDH = data;
    }, error => {
      //console.log(error.message);
    });

// Get PAST RTDH and EAP Data
  this.srService.getPastTimeH(this.unit1).subscribe(data => {
    this.unit1PastRTDH = data;
  }, error => {
    //console.log(error.message);
  });

  this.srService.getPastTimeH(this.unit2).subscribe(data => {
    this.unit2PastRTDH = data;
  }, error => {
    //console.log(error.message);
  });

  this.srService.getPastTimeH(this.unit3).subscribe(data => {
    this.unit3PastRTDH = data;
  }, error => {
    //console.log(error.message);
  });

  }

  getData() {
    this.alarmOutsideLimit = false;
    this.alarmNoconnection = false;
    this.alarmRTDChanged = false;
    this.alarmHAP = false;
    this.alarmOverride = false;
    
    // Get Current RTD and EAP Data
    this.srService.getCurrentRTD(this.unit1).subscribe(data => {
      this.unit1CurrentRTD = data;

      if(this.unit1CurrentRTD.DataStatus == "H"){
        this.alarmHAP = true;
      }
  
      if(this.unit1CurrentRTD.DataStatus == "O"){
        this.alarmOverride = true;
      }
      
    }, error => {
      //console.log(error.message);
      this.alarmNoconnection = true;
    });

    this.srService.getCurrentRTD(this.unit2).subscribe(data => {
      this.unit2CurrentRTD = data;

      if(this.unit2CurrentRTD.DataStatus == "H"){
        this.alarmHAP = true;
      }
  
      if(this.unit2CurrentRTD.DataStatus == "O"){
        this.alarmOverride = true;
      }
    }, error => {
      //console.log(error.message);
      this.alarmNoconnection = true;
    });

    this.srService.getCurrentRTD(this.unit3).subscribe(data => {
      this.unit3CurrentRTD = data;

      if(this.unit3CurrentRTD.DataStatus == "H"){
        this.alarmHAP = true;
      }
  
      if(this.unit3CurrentRTD.DataStatus == "O"){
        this.alarmOverride = true;
      }
    }, error => {
      //console.log(error.message);
      this.alarmNoconnection = true;
    });

    // Get Ahead RTD and EAP Data
    this.srService.getAheadRTD(this.unit1).subscribe(data => {
      this.unit1AheadRTD = data;
    }, error => {
      //console.log(error.message);
    });

    this.srService.getAheadRTD(this.unit2).subscribe(data => {
      this.unit2AheadRTD = data;
    }, error => {
      //console.log(error.message);
    });

    this.srService.getAheadRTD(this.unit3).subscribe(data => {
      this.unit3AheadRTD = data;
    }, error => {
      //console.log(error.message);
    });

    // Get PAST RTD and EAP Data
      this.srService.getPastTime(this.unit1).subscribe(data => {
        this.unit1PastRTD = data;
        
        if(this.unit1PastRTD[0].ActualValue != null && !this.unit1PastRTD[0].IsLimit){
          this.alarmOutsideLimit=true;
        }
      }, error => {
        //console.log(error.message);
        this.alarmNoconnection = true;
      });

      this.srService.getPastTime(this.unit2).subscribe(data => {
        this.unit2PastRTD = data;
      
        if(this.unit2PastRTD[0].ActualValue !== null && this.unit2PastRTD[0].IsLimit === false){
          this.alarmOutsideLimit=true;
        }
      }, error => {
        //console.log(error.message);
        this.alarmNoconnection = true;
      });

      this.srService.getPastTime(this.unit3).subscribe(data => {
        this.unit3PastRTD = data;  
      
        if(this.unit3PastRTD[0].ActualValue !== null && this.unit3PastRTD[0].IsLimit === false){
          this.alarmOutsideLimit=true;
        }
      }, error => {
        //console.log(error.message);
        this.alarmNoconnection = true;
      });

  }

  getCurrentUserInfo() {
    this.userService.getCurrentUserInfo().subscribe(info => {
      localStorage.setItem('current_user', JSON.stringify(info));

      this.currentUserInfo = info;
    }, error => {
      console.log(error.message);
    });
  }

  
  formatDate(date: string) {
    if (typeof date === 'undefined' || date === null) {
      return;
    }
    return moment(date).format('HH:mm');
  }

  ngOnDestroy() {
    //clearInterval(this.timerData);
    this.bodyTag.classList.remove('bg-dark');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  HAPAudio(){
    let audio = new Audio();
    audio.src = "assets/audio/hap.mp3";
    audio.load();
    audio.play();
  }

  OverrideAudio(){
    let audio = new Audio();
    audio.src = "assets/audio/override.mp3";
    audio.load();
    audio.play();
  }

  RTDChangedAudio(){
    let audio = new Audio();
    audio.src = "assets/audio/rtd_changed.mp3";
    audio.load();
    audio.play();
  }

  NoInternetAudio(){
    let audio = new Audio();
    audio.src = "assets/audio/no_connection.mp3";
    audio.load();
    audio.play();
  }

  OutsideLimitAudio(){
    let audio = new Audio();
    audio.src = "assets/audio/outside_limit.mp3";
    audio.load();
    audio.play();
  }
}
