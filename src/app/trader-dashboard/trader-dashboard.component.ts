import { Component, OnInit ,OnDestroy,ViewChild} from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { interval, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../users/users.service';
import { faRetweet,faBellSlash,faEdit } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TraderDashboardService } from './trader-dashboard.service'

declare const require;

require('highcharts/modules/no-data-to-display')(Highcharts);

@Component({
  selector: 'app-trader-dashboard',
  templateUrl: './trader-dashboard.component.html',
  styleUrls: ['./trader-dashboard.component.scss']
})
export class TraderDashboardComponent implements OnInit, OnDestroy {

  @ViewChild('alarmModal') alarmModal : any;

  private unsubscribe: Subject<any> = new Subject();
  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
  now:any;
  timerClock: any;
  timerDT: any;
  timerData: any;
  HAP;
  alertMessage:string;
  alertUnits:string;
  faRecycle= faRetweet;
  faBellSlash = faBellSlash;
  faEdit = faEdit;
  isAlarmDisable:boolean;
  isWithAlarmDisable:string;
  isGenRemarks:boolean;
  isOverrideShow:string;
  isPortfolioOnly:string;
  isShowBid:string;
  editHide:boolean;
  sites;
  currentSite = {
    name: '',
    id: ''
  };

  unitPrice;
  currentUnitPrice = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  };

  unit1;
  currentUnit1 = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  };

  unit2;
  currentUnit2 = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  };

  unit3;
  currentUnit3 = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  };

  unit4;
  currentUnit4 = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  };

  unit1PB;
  currentUnit1PB = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  };

  unit2PB;
  currentUnit2PB = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  };

  unit3PB;
  currentUnit3PB = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  };

  unit4PB;
  currentUnit4PB = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  };

  totalSchedGen ={
    ph: 0,
    luz: 0,
    vis: 0,
    min: 0
  }

  totalSchedActual = {
    ph: 0,
    luz: 0,
    vis: 0,
    min: 0
  }

  Highcharts = Highcharts;
  DEMANDseriesOptions = [];
  HADseriesOptions = [];
  DAHseriesOptions = [];
  DAPAllUnitseriesOptions = [];
  DEMANDPseriesOptions = [];
  HADOptions = {
    title: '',
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Roboto Condensed'
      }
    },

    yAxis: [{ // Primary yAxis
      labels: {
         format: '{value} MW',
         style: {
           color: 'yellow',
         }
      },
      title: {
         text: '',
         style: {
           color: 'yellow',
         }
      },
      
   }],

    xAxis: {
      type: 'category',
      gridLineWidth: 1,
      labels: {
        style: {
          color: '#fff'
        }
      },
    },

    plotOptions: {
      series: {
        compare: 'percent',
        showInNavigator: true,
        lineWidth: 4,
        marker: {
          enabled: false
        }
      }
    },

    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
      valueDecimals: 1,
      split: true
    },

    legend: {
      align: 'right',
      verticalAlign: 'top',
      itemStyle: {
        color: '#fff'
      },
      itemHoverStyle: {
        color: '#fff'
      }
    },

    series: [],
  };
  
  DAHOptions = {
    title: '',
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Roboto Condensed'
      }
    },

    xAxis: {
      type: 'category',
      gridLineWidth: 1,
      labels: {
        style: {
          color: '#fff'
        }
      },
    },
   yAxis : [
      { // Primary yAxis
         labels: {
            format: '{value} MW',
            style: {
              color: 'yellow',
            }
         },
         title: {
            text: '',
            style: {
              color: 'yellow',
            }
         },
         
      },
       { // Price yAxis
        labels: {
           format: '{value} Php',
           style: {
            color: 'yellow',
           }
        },
        title: {
           text: '',
           style: {
            color: 'yellow',
           }
        },
        opposite: true
      }     
   ],
   
   legend: {
     align: 'right',
     verticalAlign: 'top',
     itemStyle: {
       color: '#fff'
     },
     itemHoverStyle: {
       color: '#fff'
     }
   },

    plotOptions: {
      series: {
        compare: 'percent',
        showInNavigator: true,
        lineWidth: 4,
        marker: {
          enabled: false
        }
      }
    },

    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
      valueDecimals: 1,
      split: true
    },
    series: [],
  };

  DEMANDOptions = {
    title: '',
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Roboto Condensed'
      }
    },

    xAxis: {
      type: 'category',
      gridLineWidth: 1,
      labels: {
        style: {
          color: '#fff'
        }
      },
    },
   yAxis : [
      { // Primary yAxis
         labels: {
            format: '{value} MW',
            style: {
              color: 'yellow',
            }
         },
         title: {
            text: '',
            style: {
              color: 'yellow',
            }
         },
         
      },
       { // Price yAxis
        labels: {
           format: '{value} Php',
           style: {
            color: 'yellow',
           }
        },
        title: {
           text: '',
           style: {
            color: 'yellow',
           }
        },
        opposite: true
      }     
   ],
   
   legend: {
     align: 'right',
     verticalAlign: 'top',
     itemStyle: {
       color: '#fff'
     },
     itemHoverStyle: {
       color: '#fff'
     }
   },

    plotOptions: {
      series: {
        compare: 'percent',
        showInNavigator: true,
        lineWidth: 4,
        marker: {
          enabled: false
        }
      }
    },

    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
      valueDecimals: 1,
      split: true
    },
    series: [],
  };

  DEMANDPOptions = {
    title: '',
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Roboto Condensed'
      }
    },

    xAxis: {
      type: 'category',
      gridLineWidth: 1,
      labels: {
        style: {
          color: '#fff'
        }
      },
    },
   yAxis : [
      { // Primary yAxis
         labels: {
            format: '{value} MW',
            style: {
              color: 'yellow',
            }
         },
         title: {
            text: '',
            style: {
              color: 'yellow',
            }
         },
         
      },
       { // Price yAxis
        labels: {
           format: '{value} Php',
           style: {
            color: 'yellow',
           }
        },
        title: {
           text: '',
           style: {
            color: 'yellow',
           }
        },
        opposite: true
      }     
   ],
   
   legend: {
     align: 'right',
     verticalAlign: 'top',
     itemStyle: {
       color: '#fff'
     },
     itemHoverStyle: {
       color: '#fff'
     }
   },

    plotOptions: {
      series: {
        compare: 'percent',
        showInNavigator: true,
        lineWidth: 4,
        marker: {
          enabled: false
        }
      }
    },

    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
      valueDecimals: 1,
      split: true
    },
    series: [],
  };

  DAPOptions ={
    title: '',
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Roboto Condensed'
      }
    },

    xAxis: {
      type: 'category',
      gridLineWidth: 1,
      labels: {
        style: {
          color: '#fff'
        }
      },
    },
   yAxis : [
      { // Primary yAxis
         labels: {
            format: '{value} MW',
            style: {
              color: 'yellow',
            }
         },
         title: {
            text: '',
            style: {
              color: 'yellow',
            }
         },
         
      },
       { // Price yAxis
        labels: {
           format: '{value} Php',
           style: {
            color: 'yellow',
           }
        },
        title: {
           text: '',
           style: {
            color: 'yellow',
           }
        },
        opposite: true
      }     
   ],
   
   legend: {
     align: 'right',
     verticalAlign: 'top',
     itemStyle: {
       color: '#fff'
     },
     itemHoverStyle: {
       color: '#fff'
     }
   },

    plotOptions: {
      series: {
        compare: 'percent',
        showInNavigator: true,
        lineWidth: 4,
        marker: {
          enabled: false
        }
      }
    },

    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
      valueDecimals: 1,
      split: true
    },
    series: [],
  };

  DAPAllUnitOptions ={
    title: '',
    chart: {
      type: 'area',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Roboto Condensed'
      }
    },

    xAxis: {
      type: 'category',
      gridLineWidth: 1,
      labels: {
        style: {
          color: '#fff'
        }
      },
    },
   yAxis : [
      { // Primary yAxis
         labels: {
            format: '{value} MW',
            style: {
              color: 'yellow',
            }
         },
         title: {
            text: '',
            style: {
              color: 'yellow',
            }
         },
         
      },
       { // Price yAxis
        labels: {
           format: '{value} Php',
           style: {
            color: 'yellow',
           }
        },
        title: {
           text: '',
           style: {
            color: 'yellow',
           }
        },
        opposite: true
      }     
   ],
   
   legend: {
     align: 'right',
     
     verticalAlign: 'top',
     itemStyle: {
       color: '#fff'
     },
     itemHoverStyle: {
       color: '#fff'
     }
   },

    plotOptions: {
      series: {
        compare: 'percent',
        showInNavigator: true,
        lineWidth: 4,
        marker: {
          enabled: false
        }
      }
    },

    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
      valueDecimals: 1,
      split: true
    },
    series: [],
  };

  updateFlag = true;
  units;
  intervals;
  dbValues;
  pbValues;
  genRemarks;
  pbHr:string;
  pbDate:any;
  pbDateDisplay:any;
  selectedPBInterval:string;
  selectedPBRemarks:string;
  selectedPBUnitType:string;
  selectedUnitNumber:string;

  modalReference: NgbModalRef;
  currentInterval: string;
  currentTimestamp: string;
  rtdValue: number;
  isOverride: boolean;
  successMessage: string;
  errorMessage: string;
  timerMessage;
  alertType:string;
  alarmActive:boolean;
  alarmOutsideLimit:boolean;
  alarmNoconnection:boolean;
  alarmRTDChanged:boolean;
  alarmHAP:boolean;
  alarmOverride:boolean;
  timerAlarmOutsideLimit:any;
  timerAlarmHAP:any;
  luzDemand:number;
  visDemand:number;
  minDemand:number;
  PhilDemand:number;
  dashboardType:string;
  unitLuz;
  unitMin;
  unitViz;
  portfolioCurrentInterval:string;

  constructor(
    private userService: UsersService,
    private modalService: NgbModal,
    private traderDashboardService: TraderDashboardService,
    private router: Router,
    config: NgbModalConfig) { 
    config.backdrop = 'static';
    config.keyboard = false;}

  ngOnInit() {
    this.isOverrideShow = localStorage.getItem('IsOverride');
    this.isPortfolioOnly = localStorage.getItem('IsPortfolioOnly');
    this.isShowBid = localStorage.getItem('IsShowBid');
    if(this.isPortfolioOnly == 'true'){
      this.dashboardType = "portfolio";
    }else{
      this.dashboardType = "trader";
    }
    
    this.alertUnits = '';
    this.bodyTag.classList.add('bg-dark');
    this.now = moment("","MM/DD/YYYY HH:mm:ss");
    this.isWithAlarmDisable = localStorage.getItem('IsAlarmDisable');
    this.GetUnitPerRegion();
    this.SetData();
    //this.TimerSetClock();
    this.SetTimeFromServer();
    this.timerDT = setInterval(() => {
      this.SetTimeFromServer();
    }, 15000);

    this.DefaultDashboardValue();
    this.DeafultPBValue();
    this.PopulateUnits();
    this.SetIntervals();
    this.TimerGetData();
    this.alertMessage = null;
    this.GetDemand();
    this.PlotAllUnitDAPChart();
  }

  TimerSetClock(dt:string){
    //
    this.now = moment(dt,"MM/DD/YYYY HH:mm:ss");
    this.timerClock = setInterval(() => {
      this.now.add(1, 'second');
      this.SetData(); 
    }, 1000);
  }

  FormatClock(){
    //console.log(moment(this.now).format('HH'));
    return this.now.format('MMMM DD, YYYY HH:mm:ss');
  }

  TimerGetData(){
    this.timerData = setInterval(() => {
      
      if(+moment(this.now).second() == 3){
        this.RefreshData();
      }

      if(!this.isAlarmDisable && this.dashboardType == 'trader'){
        if(+moment(this.now).second() == 10){
          if(this.alarmOutsideLimit){
            this.alertMessage = "Actual MW, Outside limits!"
            this.OutsideLimitAudio();
            this.timerAlarmOutsideLimit = setInterval(() => {
            this.OutsideLimitAudio();
            }, 4000);
          }
        }

        if(+moment(this.now).minute() % 5 == 0){
          //Alarms
          if(+moment(this.now).second() == 5){
              if(this.alarmRTDChanged){
                this.alertMessage = "RTD has changed!"
                this.RTDChangedAudio();
              } 
          }
        
          if(+moment(this.now).second() == 10){
                if(this.alarmHAP){
                  this.alertMessage = "HAP is in use!"
                  this.timerAlarmHAP = setInterval(() => {
                    this.HAPAudio();
                  }, 4000);
              }else if(this.alarmOverride){
                this.alertMessage = "Override value is in use!"
                this.OverrideAudio();
              }
            }
          }
      }

      
      if(+moment(this.now).minute() == 21 && +moment(this.now).second() == 2){
          this.PlotDAPChart();
          this.PlotAllUnitDAPChart();
      }
      
  }, 1000);
  }

  SetTimeFromServer(){
      this.traderDashboardService.getDT().subscribe(data=>{
        clearInterval(this.timerData);
        clearInterval(this.timerClock);
        this.TimerSetClock(data.toString());
        this.TimerGetData();
      });
  }

  KillAlarm(){
    this.alertMessage = null;
    clearInterval(this.timerAlarmOutsideLimit);
    clearInterval(this.timerAlarmHAP);
  }

  RefreshData(){
    this.alarmOutsideLimit=false;
    this.alarmNoconnection=false;
    this.alarmRTDChanged=false;
    this.alarmHAP=false;
    this.alarmOverride=false;

    this.SetIntervals();
    if(this.currentUnitPrice.name != '' && this.currentUnitPrice.name != 'SELECT UNIT'){
      this.SetUnitPrice(this.currentUnitPrice.name);
    }
    if(this.currentUnit1.name != '' && this.currentUnit1.name != 'SELECT UNIT'){
      this.SetUnitValue(this.currentUnit1.name, 'U1');
    }
    if(this.currentUnit2.name != '' && this.currentUnit2.name != 'SELECT UNIT'){
      this.SetUnitValue(this.currentUnit2.name, 'U2');
    }
    if(this.currentUnit3.name != '' && this.currentUnit3.name != 'SELECT UNIT'){
      this.SetUnitValue(this.currentUnit3.name, 'U3');
    }
    if(this.currentUnit4.name != '' && this.currentUnit4.name != 'SELECT UNIT'){
      this.SetUnitValue(this.currentUnit4.name, 'U4');
    }

    this.GetDemand();
    this.PlotHAPChart();
    this.GetUnitPerRegion();
    this.RefreshPBRemarks();
  }

  TabActive(type: string){
    this.dashboardType = type;
    if(type == 'portfolio'){
      this.GetUnitPerRegion();
    }
  }

  DisableAlarm(){
    this.isAlarmDisable = true;
  }

  EnableAlarm(){
    this.isAlarmDisable = false;
  }

  ManualRefresh(){
    this.RefreshData();
    this.PlotDAPChart();
    this.SetTimeFromServer();
  }

  SetData() {
    this.HADOptions.series = this.HADseriesOptions;
    this.DAHOptions.series = this.DAHseriesOptions;
    this.DEMANDOptions.series = this.DEMANDseriesOptions;
    this.DEMANDPOptions.series = this.DEMANDPseriesOptions;
    this.DAPAllUnitOptions.series = this.DAPAllUnitseriesOptions;
    this.updateFlag = true;
  }

  DefaultDashboardValue(){
    this.dbValues = [ {"TimestampLabel": "00:00", "PriceSched": null, "U1Sched": null, "U2Sched": null, "U3Sched": null, "U4Sched": null, "U1Actual": null, "U2Actual": null, "U3Actual": null, "U4Actual": null, "U1IsLimit": null, "U2IsLimit": null, "U3IsLimit": null, "U4IsLimit": null, "U1Status": null, "U2Status": null, "U3Status": null, "U4Status": null },
    {"TimestampLabel": "00:00", "PriceSched": null, "U1Sched": null, "U2Sched": null, "U3Sched": null, "U4Sched": null, "U1Actual": null, "U2Actual": null, "U3Actual": null, "U4Actual": null, "U1IsLimit": null, "U2IsLimit": null, "U3IsLimit": null, "U4IsLimit": null, "U1Status": null, "U2Status": null, "U3Status": null, "U4Status": null },
    {"TimestampLabel": "00:00", "PriceSched": null, "U1Sched": null, "U2Sched": null, "U3Sched": null, "U4Sched": null, "U1Actual": null, "U2Actual": null, "U3Actual": null, "U4Actual": null, "U1IsLimit": null, "U2IsLimit": null, "U3IsLimit": null, "U4IsLimit": null, "U1Status": null, "U2Status": null, "U3Status": null, "U4Status": null },
    {"TimestampLabel": "00:00", "PriceSched": null, "U1Sched": null, "U2Sched": null, "U3Sched": null, "U4Sched": null, "U1Actual": null, "U2Actual": null, "U3Actual": null, "U4Actual": null, "U1IsLimit": null, "U2IsLimit": null, "U3IsLimit": null, "U4IsLimit": null, "U1Status": null, "U2Status": null, "U3Status": null, "U4Status": null },
    {"TimestampLabel": "00:00", "PriceSched": null, "U1Sched": null, "U2Sched": null, "U3Sched": null, "U4Sched": null, "U1Actual": null, "U2Actual": null, "U3Actual": null, "U4Actual": null, "U1IsLimit": null, "U2IsLimit": null, "U3IsLimit": null, "U4IsLimit": null, "U1Status": null, "U2Status": null, "U3Status": null, "U4Status": null },
    {"TimestampLabel": "00:00", "PriceSched": null, "U1Sched": null, "U2Sched": null, "U3Sched": null, "U4Sched": null, "U1Actual": null, "U2Actual": null, "U3Actual": null, "U4Actual": null, "U1IsLimit": null, "U2IsLimit": null, "U3IsLimit": null, "U4IsLimit": null, "U1Status": null, "U2Status": null, "U3Status": null, "U4Status": null },
    {"TimestampLabel": "00:00", "PriceSched": null, "U1Sched": null, "U2Sched": null, "U3Sched": null, "U4Sched": null, "U1Actual": null, "U2Actual": null, "U3Actual": null, "U4Actual": null, "U1IsLimit": null, "U2IsLimit": null, "U3IsLimit": null, "U4IsLimit": null, "U1Status": null, "U2Status": null, "U3Status": null, "U4Status": null },
    {"TimestampLabel": "00:00", "PriceSched": null, "U1Sched": null, "U2Sched": null, "U3Sched": null, "U4Sched": null, "U1Actual": null, "U2Actual": null, "U3Actual": null, "U4Actual": null, "U1IsLimit": null, "U2IsLimit": null, "U3IsLimit": null, "U4IsLimit": null, "U1Status": null, "U2Status": null, "U3Status": null, "U4Status": null },
    {"TimestampLabel": "00:00", "PriceSched": null, "U1Sched": null, "U2Sched": null, "U3Sched": null, "U4Sched": null, "U1Actual": null, "U2Actual": null, "U3Actual": null, "U4Actual": null, "U1IsLimit": null, "U2IsLimit": null, "U3IsLimit": null, "U4IsLimit": null, "U1Status": null, "U2Status": null, "U3Status": null, "U4Status": null },
    {"TimestampLabel": "00:00", "PriceSched": null, "U1Sched": null, "U2Sched": null, "U3Sched": null, "U4Sched": null, "U1Actual": null, "U2Actual": null, "U3Actual": null, "U4Actual": null, "U1IsLimit": null, "U2IsLimit": null, "U3IsLimit": null, "U4IsLimit": null, "U1Status": null, "U2Status": null, "U3Status": null, "U4Status": null },
    {"TimestampLabel": "00:00", "PriceSched": null, "U1Sched": null, "U2Sched": null, "U3Sched": null, "U4Sched": null, "U1Actual": null, "U2Actual": null, "U3Actual": null, "U4Actual": null, "U1IsLimit": null, "U2IsLimit": null, "U3IsLimit": null, "U4IsLimit": null, "U1Status": null, "U2Status": null, "U3Status": null, "U4Status": null },
    {"TimestampLabel": "00:00", "PriceSched": null, "U1Sched": null, "U2Sched": null, "U3Sched": null, "U4Sched": null, "U1Actual": null, "U2Actual": null, "U3Actual": null, "U4Actual": null, "U1IsLimit": null, "U2IsLimit": null, "U3IsLimit": null, "U4IsLimit": null, "U1Status": null, "U2Status": null, "U3Status": null, "U4Status": null },
    {"TimestampLabel": "00:00", "PriceSched": null, "U1Sched": null, "U2Sched": null, "U3Sched": null, "U4Sched": null, "U1Actual": null, "U2Actual": null, "U3Actual": null, "U4Actual": null, "U1IsLimit": null, "U2IsLimit": null, "U3IsLimit": null, "U4IsLimit": null, "U1Status": null, "U2Status": null, "U3Status": null, "U4Status": null },
    {"TimestampLabel": "00:00", "PriceSched": null, "U1Sched": null, "U2Sched": null, "U3Sched": null, "U4Sched": null, "U1Actual": null, "U2Actual": null, "U3Actual": null, "U4Actual": null, "U1IsLimit": null, "U2IsLimit": null, "U3IsLimit": null, "U4IsLimit": null, "U1Status": null, "U2Status": null, "U3Status": null, "U4Status": null },
    {"TimestampLabel": "00:00", "PriceSched": null, "U1Sched": null, "U2Sched": null, "U3Sched": null, "U4Sched": null, "U1Actual": null, "U2Actual": null, "U3Actual": null, "U4Actual": null, "U1IsLimit": null, "U2IsLimit": null, "U3IsLimit": null, "U4IsLimit": null, "U1Status": null, "U2Status": null, "U3Status": null, "U4Status": null }];
  }

  DeafultPBValue(){
    this.pbValues = [
      {"TimestampLabel" : "05", "U1Actual": null, "U1Remarks" : "", "U1IsHideEdit": true, "U1IsLimit":false , "U2Actual": null, "U2Remarks" : "", "U2IsHideEdit": true, "U2IsLimit":false , "U3Actual": null, "U3Remarks" : "", "U3IsHideEdit": true, "U3IsLimit":false , "U4Actual": null, "U4Remarks" : "", "U4IsHideEdit": true ,"U4IsLimit":false },
      {"TimestampLabel" : "10", "U1Actual": null, "U1Remarks" : "", "U1IsHideEdit": true, "U1IsLimit":false , "U2Actual": null, "U2Remarks" : "", "U2IsHideEdit": true, "U2IsLimit":false , "U3Actual": null, "U3Remarks" : "", "U3IsHideEdit": true, "U3IsLimit":false , "U4Actual": null, "U4Remarks" : "", "U4IsHideEdit": true ,"U4IsLimit":false },
      {"TimestampLabel" : "15", "U1Actual": null, "U1Remarks" : "", "U1IsHideEdit": true, "U1IsLimit":false , "U2Actual": null, "U2Remarks" : "", "U2IsHideEdit": true, "U2IsLimit":false , "U3Actual": null, "U3Remarks" : "", "U3IsHideEdit": true, "U3IsLimit":false , "U4Actual": null, "U4Remarks" : "", "U4IsHideEdit": true ,"U4IsLimit":false },
      {"TimestampLabel" : "20", "U1Actual": null, "U1Remarks" : "", "U1IsHideEdit": true, "U1IsLimit":false , "U2Actual": null, "U2Remarks" : "", "U2IsHideEdit": true, "U2IsLimit":false , "U3Actual": null, "U3Remarks" : "", "U3IsHideEdit": true, "U3IsLimit":false , "U4Actual": null, "U4Remarks" : "", "U4IsHideEdit": true ,"U4IsLimit":false },
      {"TimestampLabel" : "25", "U1Actual": null, "U1Remarks" : "", "U1IsHideEdit": true, "U1IsLimit":false , "U2Actual": null, "U2Remarks" : "", "U2IsHideEdit": true, "U2IsLimit":false , "U3Actual": null, "U3Remarks" : "", "U3IsHideEdit": true, "U3IsLimit":false , "U4Actual": null, "U4Remarks" : "", "U4IsHideEdit": true ,"U4IsLimit":false },
      {"TimestampLabel" : "30", "U1Actual": null, "U1Remarks" : "", "U1IsHideEdit": true, "U1IsLimit":false , "U2Actual": null, "U2Remarks" : "", "U2IsHideEdit": true, "U2IsLimit":false , "U3Actual": null, "U3Remarks" : "", "U3IsHideEdit": true, "U3IsLimit":false , "U4Actual": null, "U4Remarks" : "", "U4IsHideEdit": true ,"U4IsLimit":false },
      {"TimestampLabel" : "35", "U1Actual": null, "U1Remarks" : "", "U1IsHideEdit": true, "U1IsLimit":false , "U2Actual": null, "U2Remarks" : "", "U2IsHideEdit": true, "U2IsLimit":false , "U3Actual": null, "U3Remarks" : "", "U3IsHideEdit": true, "U3IsLimit":false , "U4Actual": null, "U4Remarks" : "", "U4IsHideEdit": true ,"U4IsLimit":false },
      {"TimestampLabel" : "40", "U1Actual": null, "U1Remarks" : "", "U1IsHideEdit": true, "U1IsLimit":false , "U2Actual": null, "U2Remarks" : "", "U2IsHideEdit": true, "U2IsLimit":false , "U3Actual": null, "U3Remarks" : "", "U3IsHideEdit": true, "U3IsLimit":false , "U4Actual": null, "U4Remarks" : "", "U4IsHideEdit": true ,"U4IsLimit":false },
      {"TimestampLabel" : "45", "U1Actual": null, "U1Remarks" : "", "U1IsHideEdit": true, "U1IsLimit":false , "U2Actual": null, "U2Remarks" : "", "U2IsHideEdit": true, "U2IsLimit":false , "U3Actual": null, "U3Remarks" : "", "U3IsHideEdit": true, "U3IsLimit":false , "U4Actual": null, "U4Remarks" : "", "U4IsHideEdit": true ,"U4IsLimit":false },
      {"TimestampLabel" : "50", "U1Actual": null, "U1Remarks" : "", "U1IsHideEdit": true, "U1IsLimit":false , "U2Actual": null, "U2Remarks" : "", "U2IsHideEdit": true, "U2IsLimit":false , "U3Actual": null, "U3Remarks" : "", "U3IsHideEdit": true, "U3IsLimit":false , "U4Actual": null, "U4Remarks" : "", "U4IsHideEdit": true ,"U4IsLimit":false },
      {"TimestampLabel" : "55", "U1Actual": null, "U1Remarks" : "", "U1IsHideEdit": true, "U1IsLimit":false , "U2Actual": null, "U2Remarks" : "", "U2IsHideEdit": true, "U2IsLimit":false , "U3Actual": null, "U3Remarks" : "", "U3IsHideEdit": true, "U3IsLimit":false , "U4Actual": null, "U4Remarks" : "", "U4IsHideEdit": true ,"U4IsLimit":false },
      {"TimestampLabel" : "60", "U1Actual": null, "U1Remarks" : "", "U1IsHideEdit": true, "U1IsLimit":false , "U2Actual": null, "U2Remarks" : "", "U2IsHideEdit": true, "U2IsLimit":false , "U3Actual": null, "U3Remarks" : "", "U3IsHideEdit": true, "U3IsLimit":false , "U4Actual": null, "U4Remarks" : "", "U4IsHideEdit": true ,"U4IsLimit":false }
    ];

    this.genRemarks = [{"U1Remarks": "" ,
    "U1IsHideEdit":true, 
    "U1UnitNumber": "",
    "U2Remarks": "" ,
    "U2IsHideEdit":true, 
    "U2UnitNumber": "", 
    "U3Remarks": "" ,
    "U3IsHideEdit":true, 
    "U3UnitNumber": "",
    "U4Remarks": "" ,
    "U4IsHideEdit":true, 
    "U4UnitNumber": "" }];

    this.pbDate = moment();
    if(this.pbDate.format("HH") == "00"){
      this.pbDateDisplay = this.pbDate.add(-1,'day').format("MM/DD/YYYY");
      this.pbHr = "24";
    }else{
      this.pbDateDisplay = this.pbDate.format("MM/DD/YYYY");
      this.pbHr = this.pbDate.format("HH");
    }
  }

  AddPBDate(){
    if(this.pbHr == "24"){
      this.pbDate.add(1,'day');
    }
    this.pbDate.add(1,'hour');
    if(this.pbDate.format("HH") == "00"){
      this.pbDateDisplay = this.pbDate.add(-1,'day').format("MM/DD/YYYY");
      this.pbHr = "24";
    }else{
      this.pbDateDisplay = this.pbDate.format("MM/DD/YYYY");
      this.pbHr = this.pbDate.format("HH");
    }

    this.RefreshPBRemarks();
  }

  RefreshPBRemarks(){
    if(this.currentUnit1PB.name != '' && this.currentUnit1PB.name != 'SELECT UNIT'){
      this.SetPBUnitValue(this.currentUnit1PB.name, 'U1');
    }
    if(this.currentUnit2PB.name != '' && this.currentUnit2PB.name != 'SELECT UNIT'){
      this.SetPBUnitValue(this.currentUnit2PB.name, 'U2');
    }
    if(this.currentUnit3PB.name != '' && this.currentUnit3PB.name != 'SELECT UNIT'){
      this.SetPBUnitValue(this.currentUnit3PB.name, 'U3');
    }
    if(this.currentUnit4PB.name != '' && this.currentUnit4PB.name != 'SELECT UNIT'){
      this.SetPBUnitValue(this.currentUnit4PB.name, 'U4');
    }
  }

  LessPBDate(){
    if(this.pbHr == "24"){
      this.pbDate.add(1,'day');
    }
    this.pbDate = this.pbDate.add(-1,'hour');
    if(this.pbDate.format("HH") == "00"){
      this.pbDateDisplay = this.pbDate.add(-1,'day').format("MM/DD/YYYY");
      this.pbHr = "24";
    }else{
      this.pbDateDisplay = this.pbDate.format("MM/DD/YYYY");
      this.pbHr = this.pbDate.format("HH");
    }

    this.RefreshPBRemarks();
  }

  OpenPBRemarksModal(content: NgbModal, unitNumber:string, interval:string, remarks:string, isGenR:boolean, unit:string, index:number){
    if(unitNumber != '' && unitNumber != 'SELECT UNIT'){
      this.isGenRemarks = isGenR;
      this.selectedUnitNumber = unitNumber;
      this.selectedPBInterval = interval;
      this.selectedPBRemarks = remarks;
      this.selectedPBUnitType = unit;
      this.modalReference = this.modalService.open(content, {size: 'sm',centered:true});
    }
  }
  
  SaveRemarks(){
  let dateTime;
  
  if(this.selectedPBInterval == "60"){
    dateTime = moment(this.pbDate).add(1,'hour').format("MM/DD/YYYY HH") + ":00";
  }else{
    dateTime = this.pbDate.format("MM/DD/YYYY HH") + ":" + this.selectedPBInterval;
  }

  if(this.pbHr == '24'){
    dateTime = moment(dateTime).add(1,'day').format("MM/DD/YYYY HH:mm");
  }
  
  const payload = {
    Timestamp: dateTime,
    UnitNumber: this.selectedUnitNumber,
    Value: this.selectedPBRemarks
  };
  
  if(this.isGenRemarks){
    this.traderDashboardService.saveGeneralRemarks(payload).subscribe(data => {
      this.successMessage = "Remarks successfully saved!";
      this.genRemarks[0][this.selectedPBUnitType + "Remarks"] = this.selectedPBRemarks;
      this.modalReference.close();
      this.timerMessage = setInterval(() => {
        this.successMessage = null;
        clearInterval(this.timerMessage);
        }, 3000);
    });
  }else{
    this.traderDashboardService.saveRemarks(payload).subscribe(data => {
      this.successMessage = "Remarks successfully saved!";
      this.modalReference.close();
      this.timerMessage = setInterval(() => {
        this.successMessage = null;
        clearInterval(this.timerMessage);
        }, 3000);
        this.RefreshPBRemarks();
    });
  }
  
  }

  PlotHAPChart(){
    const unit1 = [];
    const unit2 = [];
    const unit3 = [];
    const unit4 = [];

    
    this.HADseriesOptions = [];

    if(this.currentUnit1.name != '' && this.currentUnit1.name != 'SELECT UNIT'){
      this.traderDashboardService.getHAP(this.currentUnit1.name).subscribe(data=>{
        let hap = data;
        Object.keys(hap).forEach(element => {
          unit1.push([hap[element].TimestampLabel, hap[element].Value]);
        });
  
       this.HADseriesOptions.push(
            {
              name: this.currentUnit1.name,
              color: 'yellow',
              data: unit1
            },
          );
      });
    }
    if(this.currentUnit2.name != '' && this.currentUnit2.name != 'SELECT UNIT'){
      this.traderDashboardService.getHAP(this.currentUnit2.name).subscribe(data=>{
        let hap = data;
        Object.keys(hap).forEach(element => {
            unit2.push([hap[element].TimestampLabel, hap[element].Value]);
          });

        this.HADseriesOptions.push(
            {
              name: this.currentUnit2.name,
              color: '#3a87ff',
              data: unit2
            },
          );
      });
    }

    if(this.currentUnit3.name != '' && this.currentUnit3.name != 'SELECT UNIT'){
      this.traderDashboardService.getHAP(this.currentUnit3.name).subscribe(data=>{
        let hap = data;
        Object.keys(hap).forEach(element => {
            unit3.push([hap[element].TimestampLabel, hap[element].Value]);
          });

        this.HADseriesOptions.push(
            {
              name: this.currentUnit3.name,
              color: '#3df463',
              data: unit3
            },
          );
      });
    }
    if(this.currentUnit4.name != '' && this.currentUnit4.name != 'SELECT UNIT'){
      this.traderDashboardService.getHAP(this.currentUnit4.name).subscribe(data=>{
        let hap = data;
        Object.keys(hap).forEach(element => {
            unit4.push([hap[element].TimestampLabel, hap[element].Value]);
          });

        this.HADseriesOptions.push(
            {
              name: this.currentUnit4.name,
              color: '#ff9454',
              data: unit4
            },
          );
      });
    }

    this.SetData();
  }

  PlotDAPChart(){
    const unit1 = [];
    const unit2 = [];
    const unit3 = [];
    const unit4 = [];

    
    this.DAHseriesOptions = [];

    if(this.currentUnit1.name != '' && this.currentUnit1.name != 'SELECT UNIT'){
      this.traderDashboardService.getDAP(this.currentUnit1.name).subscribe(data=>{
        let hap = data;
        Object.keys(hap).forEach(element => {
          unit1.push([hap[element].TimestampLabel, hap[element].Value]);
        });
  
       this.DAHseriesOptions.push(
            {
              name: this.currentUnit1.name,
              color: 'yellow',
              data: unit1
            },
          );
      });
    }
    if(this.currentUnit2.name != '' && this.currentUnit2.name != 'SELECT UNIT'){
      this.traderDashboardService.getDAP(this.currentUnit2.name).subscribe(data=>{
        let hap = data;
        Object.keys(hap).forEach(element => {
            unit2.push([hap[element].TimestampLabel, hap[element].Value]);
          });

        this.DAHseriesOptions.push(
            {
              name: this.currentUnit2.name,
              color: '#3a87ff',
              data: unit2
            },
          );
      });
    }

    if(this.currentUnit3.name != '' && this.currentUnit3.name != 'SELECT UNIT'){
      this.traderDashboardService.getDAP(this.currentUnit3.name).subscribe(data=>{
        let hap = data;
        Object.keys(hap).forEach(element => {
            unit3.push([hap[element].TimestampLabel, hap[element].Value]);
          });

        this.DAHseriesOptions.push(
            {
              name: this.currentUnit3.name,
              color: '#3df463',
              data: unit3
            },
          );
      });
    }
    if(this.currentUnit4.name != '' && this.currentUnit4.name != 'SELECT UNIT'){
      this.traderDashboardService.getDAP(this.currentUnit4.name).subscribe(data=>{
        let hap = data;
        Object.keys(hap).forEach(element => {
            unit4.push([hap[element].TimestampLabel, hap[element].Value]);
          });

        this.DAHseriesOptions.push(
            {
              name: this.currentUnit4.name,
              color: '#ff9454',
              data: unit4
            },
          );
      });
    }

    this.SetData();
  }

  PlotAllUnitDAPChart(){
    this.DAPAllUnitseriesOptions = [];
    this.traderDashboardService.getAllUnitDAP().subscribe(data => {
      //console.log(data);
      Object.keys(data).forEach(element => {
        let piVal = data[element]['PIValue'];
        let dap = [];
        Object.keys(piVal).forEach(elementval => {
          dap.push([piVal[elementval].TimestampLabel, piVal[elementval].Value]);
        });

        this.DAPAllUnitseriesOptions.push(
          {
            showInLegend:false,
            name: data[element].UnitNumber,
            color: 'orange',
            data: dap
          },
        );
      });
    });
    
  }

  PopulateUnits(){
    let permissionID = +localStorage.getItem('PermissionID');
    this.traderDashboardService.getUnitPerAccess(+permissionID).subscribe(data => {
      this.unitPrice = data;
      this.unit1 = data;
      this.unit2 = data;
      this.unit3 = data;
      this.unit4 = data;
      this.unit1PB = data;
      this.unit2PB = data;
      this.unit3PB = data;
      this.unit4PB = data;
    });
  }

  PlotDemandChart(luzDemand,visDemand,minDemand){
    const luz = [];
    const viz = [];
    const min = [];

    this.DEMANDseriesOptions = [];
    Object.keys(luzDemand).forEach(element => {
      luz.push([luzDemand[element].TimestampLabel, luzDemand[element].Value]);
    });

    this.DEMANDseriesOptions.push(
      {
        name: 'LUZ',
        color: '#3df463',
        data: luz
      },
    );

    Object.keys(visDemand).forEach(element => {
      viz.push([visDemand[element].TimestampLabel, visDemand[element].Value]);
    });
    this.DEMANDseriesOptions.push(
      {
        name: 'VIZ',
        color: '#3a87ff',
        data: viz
      },
    );
    
    Object.keys(minDemand).forEach(element => {
      min.push([minDemand[element].TimestampLabel, minDemand[element].Value]);
    });

    this.DEMANDseriesOptions.push(
      {
        name: 'MIN',
        color: '#ff9454',
        data: min
      },
    );
  }

  PlotDemandPorfolioChart(luzDemand,visDemand,minDemand,priceDemand){
    const luz = [];
    const viz = [];
    const min = [];
    const price = [];
    this.DEMANDPseriesOptions = [];
    Object.keys(luzDemand).forEach(element => {
      luz.push([luzDemand[element].TimestampLabel, luzDemand[element].Value]);
    });

    Object.keys(visDemand).forEach(element => {
      viz.push([visDemand[element].TimestampLabel, visDemand[element].Value]);
    });

    Object.keys(minDemand).forEach(element => {
      min.push([minDemand[element].TimestampLabel, minDemand[element].Value]);
    });

    Object.keys(priceDemand).forEach(element => {
      price.push([priceDemand[element].TimestampLabel, priceDemand[element].Value]);
    });

    this.DEMANDPseriesOptions.push(
      {
        name: 'LUZ',
        color: '#3df463',
        data: luz
      },
      {
        name: 'VIZ',
        color: '#3a87ff',
        data: viz
      },
      {
        name: 'MIN',
        color: '#ff9454',
        data: min
      },{
        name: 'PRICE',
        color: 'yellow',
        data: price,
        yAxis:1
      }
    );
   
  }

  GetDemand(){
    let priceUnitNumber:string;
    if(this.currentUnitPrice.name != '' && this.currentUnitPrice.name != 'SELECT UNIT'){
      priceUnitNumber = this.currentUnitPrice.name;
    }else{
      priceUnitNumber = "";
    }

    this.traderDashboardService.getDemand(priceUnitNumber).subscribe(data=>{
      let currentDemands = data[0]['PIValue'];
      let hLuzdemand = data[1]['PIValue'];
      let hVisdemand = data[2]['PIValue'];
      let hMindemand = data[3]['PIValue'];
      let hPricedemand = data[4]['PIValue'];

      this.luzDemand = currentDemands[0]['Value'];
      this.visDemand = currentDemands[1]['Value'];
      this.minDemand = currentDemands[2]['Value'];
      this.PhilDemand = (+this.luzDemand) +  (+this.visDemand) + (+this.minDemand);
      //this.PlotDemandChart(hLuzdemand,hVisdemand,hMindemand);
      this.PlotDemandPorfolioChart(hLuzdemand,hVisdemand,hMindemand,hPricedemand);
    });
  }

  SetUnitPrice(unitNumber:string){
    this.traderDashboardService.getPrice(unitNumber).subscribe(data => {
      let price = data;
      for(let x= 0; x<= 14; x++){
        this.dbValues[x].PriceSched = price[x].Value;
       }

       this.GetDemand();
    });
  }

   SetUnitValue(unitNumber:string, unitType:string){
     this.traderDashboardService.getRTD(unitNumber).subscribe(data => {
      let rtd = data;
        for(let x= 0; x<= 14; x++){
          this.dbValues[x][unitType+"Sched"] = rtd[x].Value;
           this.dbValues[x][unitType+"Actual"] = rtd[x].Actual;
           this.dbValues[x][unitType+"IsLimit"] = rtd[x].IsLimit;
           this.dbValues[x][unitType+"Status"] = rtd[x].DataStatus;
         }
      
//rtd[5].Actual != null && 
          if(rtd[5].Actual != null && rtd[5].IsLimit == false){
            this.alarmOutsideLimit=true;
          }
   
          if(rtd[4].DataStatus == "H"){
            this.alarmHAP = true;
          }

          if(rtd[4].DataStatus == "O"){
            this.alarmOverride = true;
          }

          if(rtd[4].Value != rtd[5].Value){
            this.alarmRTDChanged = true;
          }
    });
  }

  SetPBUnitValue(unitNumber:string, unitType:string){
    let pdDateDuplicate = this.pbDate;
    if(this.pbHr == "24"){
      pdDateDuplicate.add(1,"day");
    }

    this.traderDashboardService.getPBRemarks(unitNumber,pdDateDuplicate.format("MM/DD/YYYY HH")).subscribe(data => {
     let rtd = data['sched'];
     let genR = data['genRemarks'];

     if(genR != null){
      this.genRemarks[0][unitType+"Remarks"] = genR['Value'];
      this.genRemarks[0][unitType+"UnitNumber"] = genR['UnitNumber'];
     }else{
      this.genRemarks[0][unitType+"Remarks"] = null;
      this.genRemarks[0][unitType+"UnitNumber"] = null;
     }
     
     
     //console.log(this.genRemarks);
       for(let x= 0; x<= 11; x++){
          this.pbValues[x][unitType+"Actual"] = rtd[x].Actual;
          this.pbValues[x][unitType+"IsLimit"] = rtd[x].IsLimit;
          this.pbValues[x][unitType+"Remarks"] = rtd[x].Value;
        }

        if(this.pbHr == "24"){
          pdDateDuplicate.add(-1,"day");
        }
   });
  }

  SetIntervals(){
    this.traderDashboardService.getInterval().subscribe(data => {
      let interval = data;
      for(let x= 0; x<= 14; x++){
        this.dbValues[x].TimestampLabel = interval[x].TimestampLabel;
       }
       this.currentTimestamp = interval[4].Timestamp;
    },error=>{
      error;
      this.alertMessage = "No connection to server!";
      this.NoInternetAudio();
    });
  }

  selectedUnit(id:number,units, currentUnit, unitType:string){
    const selected = units.find(unit => unit.UnitID === id);
    currentUnit.id = selected.UnitID;
    currentUnit.name = selected.UnitNumber; 

    if(currentUnit.name=='SELECT UNIT'){
      for(let x= 0; x<= 14; x++){
        this.dbValues[x][unitType+"Sched"] = null;
         this.dbValues[x][unitType+"Actual"] = null;
         this.dbValues[x][unitType+"IsLimit"] = null;
         this.dbValues[x][unitType+"Status"] = null;
       }
       this.PlotHAPChart();
       this.PlotDAPChart();
      }else{
        if(unitType == 'Price'){
          this.SetUnitPrice(currentUnit.name);
        }else{
          this.SetUnitValue(currentUnit.name,unitType);
          this.PlotHAPChart();
          this.PlotDAPChart();
        }
      }
    
  }

  selectedPBUnit(id:number,units, currentUnit, unitType:string){
    const selected = units.find(unit => unit.UnitID === id);
    currentUnit.id = selected.UnitID;
    currentUnit.name = selected.UnitNumber; 

    if(currentUnit.name=='SELECT UNIT'){
      for(let x= 0; x<= 11; x++){
         this.pbValues[x][unitType+"Actual"] = null;
         this.pbValues[x][unitType+"IsLimit"] = null;
         this.pbValues[x][unitType+"Remarks"] = null;
       }

       this.genRemarks[0][unitType+"Remarks"] = null;
       this.genRemarks[0][unitType+"UnitNumber"] = null;
       }else{
          this.SetPBUnitValue(currentUnit.name,unitType);
      }
  }

  OpenOverridModal(content: NgbModal, unitNumber:string){
    this.selectedUnitNumber = unitNumber;
    this.traderDashboardService.getOverrideValue(unitNumber).subscribe(data => {
      let overrideValue = data;

      this.isOverride = overrideValue['IsUse'];
      this.rtdValue = overrideValue['Value'];
    });

    this.modalReference = this.modalService.open(content, {size: 'sm',centered:true});
  }

  OverrideValue(){
    if(this.isOverride && this.rtdValue == null){
      return
    }

    const payload = {
      IsUse: this.isOverride,
      UnitNumber: this.selectedUnitNumber,
      Value: this.rtdValue
    };
    
    this.traderDashboardService.saveOverrideValue(payload).subscribe(data => {
      if(this.isOverride){
        this.successMessage = "Unit " + this.selectedUnitNumber + " Override value is Active";
      }else{
        this.successMessage = "Unit " + this.selectedUnitNumber + " Override value is Inactive";
      }
      
      this.modalReference.close();
      this.timerMessage = setInterval(() => {
        this.successMessage = null;
        clearInterval(this.timerMessage);
        }, 3000);

        if(this.currentUnit1.name != '' && this.currentUnit1.name == this.selectedUnitNumber){
          this.SetUnitValue(this.currentUnit1.name, 'U1');
        }
        if(this.currentUnit2.name != '' && this.currentUnit2.name == this.selectedUnitNumber){
          this.SetUnitValue(this.currentUnit2.name, 'U2');
        }
        if(this.currentUnit3.name != '' && this.currentUnit3.name == this.selectedUnitNumber){
          this.SetUnitValue(this.currentUnit3.name, 'U3');
        }
        if(this.currentUnit4.name != '' && this.currentUnit4.name == this.selectedUnitNumber){
          this.SetUnitValue(this.currentUnit4.name, 'U4');
        }
    });
  }

  getCurrentInterval(interval:string){
    this.currentInterval = interval;
    return interval;
  }

  ngOnDestroy() {
    //clearInterval(this.timerData);
    //clearInterval(this.timerDT);
    //this.KillAlarm();
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

  GetUnitPerRegion(){
    let totalLuz:number;
    let totalVis:number;
    let totalMin:number;

    this.traderDashboardService.getUnitRegion().subscribe(data=>{
      this.unitLuz = data['Luz'];
      this.unitViz = data['Vis'];
      this.unitMin = data['Min'];
      this.portfolioCurrentInterval = this.unitLuz[0]['TimestampLabel'];

      totalVis = 0;
      totalLuz = 0;
      totalMin = 0;
      this.unitLuz.forEach(element => {
        if(element['RTD']!= null){
          totalLuz += +element['RTD'];
        }
      });

      this.unitViz.forEach(element => {
        if(element['RTD']!= null || element['RTD']!= undefined){
          totalVis += +element['RTD'];
        }
      });

      this.unitMin.forEach(element => {
        if(element['RTD']!= null ){
          totalMin += +element['RTD'];
        }
      });

      this.totalSchedGen.vis = totalVis == undefined ? 0 : totalVis;
      this.totalSchedGen.luz = totalLuz == undefined ? 0 : totalLuz;
      this.totalSchedGen.min = totalMin == undefined ? 0 : totalMin;
      this.totalSchedGen.ph = this.totalSchedGen.luz + this.totalSchedGen.vis + this.totalSchedGen.min;
      totalVis = 0;
      totalLuz = 0;
      totalMin = 0;

      this.unitLuz.forEach(element => {
        if(element['Actual']!= null){
          totalLuz += +element['Actual'];
        }
      });

      this.unitViz.forEach(element => {
        if(element['Actual']!= null || element['Actual']!= undefined){
          totalVis += +element['Actual'];
        }
      });

      this.unitMin.forEach(element => {
        if(element['Actual']!= null ){
          totalMin += +element['Actual'];
        }
      });

      this.totalSchedActual.vis = totalVis == undefined ? 0 : totalVis;
      this.totalSchedActual.luz = totalLuz == undefined ? 0 : totalLuz;
      this.totalSchedActual.min = totalMin == undefined ? 0 : totalMin;
      this.totalSchedActual.ph = this.totalSchedActual.luz + this.totalSchedActual.vis + this.totalSchedActual.min;
    });

  }
}
