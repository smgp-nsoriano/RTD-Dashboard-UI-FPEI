import { Component, OnInit ,OnDestroy,ViewChild} from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { Subscription, interval, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../users/users.service';
import { faRetweet,faBellSlash,faEdit } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TraderDashboardService } from './trader-dashboard.service'
import { EventService } from './EventService';
import { UnitSelectionService } from '../unit-selection.service';
// import { DatePipe } from '@angular/common';

declare const require;

require('highcharts/modules/no-data-to-display')(Highcharts);

@Component({
  selector: 'app-trader-dashboard',
  templateUrl: './trader-dashboard.component.html',
  styleUrls: ['./trader-dashboard.component.scss'],
})
export class TraderDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('alarmModal') alarmModal : any;
  private subscription: Subscription;
  private unsubscribe: Subject<any> = new Subject();
  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
  now:any;
  tempValue:any
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
  alarmEnable:boolean;
  isWithAlarmDisable:string;
  isGenRemarks:boolean;
  isOverrideShow:string;
  isMOTShow:string;
  isPortfolioOnly:string;
  isPbReason:string;
  isShowBid:string;
  isShowPrice:string;
  editHide:boolean;
  sites;
  unitNumberFromBidHistory: string = '';
  
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

  portfolioCurrentUnitPrice = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  }

  currentUnitBids: any = { id: null, name: '' }; // used by Bids tab

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

  RMunit1;
  RMcurrentUnit1 = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  }
  RMunit2;
  RMcurrentUnit2 = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  }
  RMunit3;
  RMcurrentUnit3 = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  }

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
  ImportExporteriesOptions = [];
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

  ImportExportOptions = {
    title: '',
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Roboto Condensed'
      },
      type:'column',
      //animation: false
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
        stacking: 'normal',
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
  selectedDate: string | null = null;
  loading: boolean = false;
  bidLogs: any[] = [];
  selectedBidArchive: any[] = [];
  selectedBidHistoryId: number = null;
  showBidArchive = false;
  modalReference: NgbModalRef;
  currentInterval: string;
  currentTimestamp: string;
  rtdValue: number;
  rtdRound1: number;
  rtdRound2: number;
  MOTValue: number;
  isOverride: boolean;
  isMOT: boolean;
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
  timerAlarmNoConnection:any;
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
  isOperator:boolean;
  isSPDC:boolean;
  isImport:boolean;
  userPermission: any;
  constructor(
    private userService: UsersService,
    private unitPriceService:UnitSelectionService,
    private modalService: NgbModal,
    private traderDashboardService: TraderDashboardService,
    private eventService: EventService,
    private router: Router,
    config: NgbModalConfig
  ) { 
    config.backdrop = 'static';
    config.keyboard = false;}


  ngOnInit() {
    
    this.userService.getCurrentUserInfo().subscribe(info => {
      this.userPermission = info;
    });



    this.selectedDate = new Date().toISOString().split('T')[0];

    this.subscription = this.unitPriceService.currentUnitPrice$.subscribe(unitPrice => {
      if (unitPrice) {
        this.portfolioCurrentUnitPrice = unitPrice;
      } else {
        this.portfolioCurrentUnitPrice.name = "01SUAL_G01" ;
      }
    });    


    this.isImport = true;
    this.CheckUserType();
    this.isOverrideShow = localStorage.getItem('IsOverride');
    this.isPortfolioOnly = localStorage.getItem('IsPortfolioOnly');
    this.isPbReason = localStorage.getItem('IsPbReason');
    this.isShowPrice = localStorage.getItem('IsShowPrice');
    this.isShowBid = localStorage.getItem('IsShowBid');
    this.dashboardType = "trader";
    this.alertUnits = '';
    this.bodyTag.classList.add('bg-dark');
    this.now = moment("","MM/DD/YYYY HH:mm:ss");
    this.isWithAlarmDisable = localStorage.getItem('IsAlarmDisable');
    this.GetUnitPerRegion();
    
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
    this.GetDemand();
    this.PlotAllUnitDAPChart();
    this.GetPortfolioDemand();
    //this.SetData();


  }

  CheckUserType(){
    this.isOperator = Boolean(JSON.parse(localStorage.getItem('isOperator')));
    this.isSPDC =  Boolean(JSON.parse(localStorage.getItem('isSPDC')));
    //console.log(localStorage.getItem('userToken'));

    if(this.isOperator == true){
      if(this.isSPDC==true){
        this.router.navigate(['/spdc-monitoring']);
      }else{
        this.router.navigate(['/home']);
      }
    } 
  }

  TimerSetClock(dt:string){
    //
    this.now = moment(dt,"MM/DD/YYYY HH:mm:ss");
    this.timerClock = setInterval(() => {
      this.now.add(1, 'second');
      // this.HADOptions.series = this.HADseriesOptions;
      // this.DAPAllUnitOptions.series = this.DAPAllUnitseriesOptions;
      // this.updateFlag = true;
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
            this.OutsideLimitAudio();
            this.alertMessage = "Actual MW, Outside limits!";
            this.timerAlarmOutsideLimit = setInterval(() => {
            this.OutsideLimitAudio();
            }, 5000);
          }
        }

        const currentHours = +moment(this.now).hour();
        const currentMinute = +moment(this.now).minute();
        const currentSecond = +moment(this.now).second();
        //const alarmMinutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
        // console.log("Current hours:", currentHours);
        // console.log("Current minute:", currentMinute);
        // console.log("Current second:", currentSecond);
        // console.log(this.alarmRTDChanged);

        if(+moment(this.now).minute() % 5 == 0){
          //console.log("Minute is in the alarm list");
          if(+moment(this.now).second() >= 4 && +moment(this.now).second()<=15){
            //console.log("Second is from 5s to 10s");
              if(this.alarmRTDChanged){
                this.alertMessage = "RTD has changed!";
                this.RTDChangedAudio();
                this.alarmRTDChanged=false;
              } 
          }
        
          if(+moment(this.now).second() == 10){
                if(this.alarmHAP){
                  this.alertMessage = "HAP is in use!"
                  this.timerAlarmHAP = setInterval(() => {
                    this.HAPAudio();
                  }, 4000);
              }else if(this.alarmOverride){
                this.alertMessage = "Override value is in use!";
                this.OverrideAudio();
              }
            }
          }else{
            this.alarmRTDChanged=false;
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
    this.alarmOutsideLimit=false;
    this.alarmRTDChanged=false;
    this.alarmHAP=false;
    this.alarmOverride=false;
    clearInterval(this.timerAlarmOutsideLimit);
    clearInterval(this.timerAlarmHAP);
    clearInterval(this.timerAlarmNoConnection);
  }

  RefreshData(){
    this.alarmOutsideLimit=false;
    this.alarmNoconnection=false;
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

    if(this.RMcurrentUnit1.name != '' && this.RMcurrentUnit1.name != 'SELECT UNIT'){
      this.SetUnitValue(this.currentUnit4.name, 'U4');
    }
  }

  TabActive(type: string){
    this.dashboardType = type;
    if(type == 'portfolio'){
      this.GetUnitPerRegion();
    }
    // this.GetDemand();
    this.GetPortfolioDemand();
  }

  DisableAlarm(){
    console.log("trader disabling alarm");
    this.eventService.disableAlarm();
    this.alarmOutsideLimit=false;
    this.alarmNoconnection=false;
    this.alarmRTDChanged=false;
    this.alertMessage=null;
    clearInterval(this.timerAlarmHAP);
    clearInterval(this.timerAlarmOutsideLimit);
    this.eventService.setItem('tempValue', this.isAlarmDisable=true);
    this.isAlarmDisable = true;
  }

  EnableAlarm(){
    console.log("trader enabling alarm");
    this.eventService.enableAlarm();
    this.eventService.setItem('tempValue', this.isAlarmDisable=false);
    this.isAlarmDisable = false;
  }

  ManualRefresh(){
    clearTimeout(this.timerAlarmOutsideLimit);
    clearInterval(this.timerAlarmNoConnection);
    this.alertMessage = null;
    console.log("Energy Trader Refresh Triggered")
    this.eventService.Refresh();//call to refresh the pages for RM,RR,RP
    this.RefreshData();
    this.PlotDAPChart();
    this.SetTimeFromServer();
  }

  // SetData() {
  //   this.HADOptions.series = this.HADseriesOptions;
  //   this.DAHOptions.series = this.DAHseriesOptions;
  //   this.DEMANDOptions.series = this.DEMANDseriesOptions;
  //   this.DEMANDPOptions.series = this.DEMANDPseriesOptions;
  //   this.DAPAllUnitOptions.series = this.DAPAllUnitseriesOptions;
  //   this.updateFlag = true;
  // }

  

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

  pbdate = moment(new Date()).format("YYYY-MM-DD"); // idk how this particular one works; angular is weird; but it works.. sooo...
  saverange(newValue){
    let dateObj = moment(newValue)
    this.pbDate = dateObj;
    this.pbDateDisplay = dateObj.format("MM/DD/YYYY");
    this.RefreshPBRemarks();
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
      this.userLogs('PB_General_Remarks: ' + this.selectedUnitNumber + '( ' + this.selectedPBRemarks + ' )');
      this.modalReference.close();
      this.timerMessage = setInterval(() => {
        this.successMessage = null;
        clearInterval(this.timerMessage);
        }, 3000);
    });
  }else{
    this.traderDashboardService.saveRemarks(payload).subscribe(data => {
      this.successMessage = "Remarks successfully saved!";
      this.userLogs('PB_Remarks: ' + this.selectedUnitNumber + '( ' + this.selectedPBRemarks + ' ) | Interval: ' + dateTime);
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

    this.HADOptions.series = this.HADseriesOptions;
    this.updateFlag = true;
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

    this.DAHOptions.series = this.DAHseriesOptions;
    this.updateFlag = true;
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

    this.DAPAllUnitOptions.series = this.DAPAllUnitseriesOptions;
    this.updateFlag = true;
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
      this.RMunit1 = data;
      this.RMunit2 = data;
      this.RMunit3 = data;
    });
  }
  PlotDemandChart(luzDemand,visDemand,minDemand,priceDemand){
    const luz = [];
    const viz = [];
    const min = [];
    const price = [];
    this.DEMANDseriesOptions = [];
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

    this.DEMANDseriesOptions.push(
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

    this.DEMANDOptions.series = this.DEMANDseriesOptions;
    this.updateFlag = true;
  }
  // PlotDemandChart(luzDemand,visDemand,minDemand,){
  //   const luz = [];
  //   const viz = [];
  //   const min = [];

  //   this.DEMANDseriesOptions = [];
  //   Object.keys(luzDemand).forEach(element => {
  //     luz.push([luzDemand[element].TimestampLabel, luzDemand[element].Value]);
  //   });

  //   this.DEMANDseriesOptions.push(
  //     {
  //       name: 'LUZ',
  //       color: '#3df463',
  //       data: luz
  //     },
  //   );

  //   Object.keys(visDemand).forEach(element => {
  //     viz.push([visDemand[element].TimestampLabel, visDemand[element].Value]);
  //   });
  //   this.DEMANDseriesOptions.push(
  //     {
  //       name: 'VIZ',
  //       color: '#3a87ff',
  //       data: viz
  //     },
  //   );
    
  //   Object.keys(minDemand).forEach(element => {
  //     min.push([minDemand[element].TimestampLabel, minDemand[element].Value]);
  //   });

  //   this.DEMANDseriesOptions.push(
  //     {
  //       name: 'MIN',
  //       color: '#ff9454',
  //       data: min
  //     },
  //   );

  //   this.DEMANDOptions.series = this.DEMANDseriesOptions;
  //   this.updateFlag = true;
  // }

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

    this.DEMANDPOptions.series = this.DEMANDPseriesOptions;
    this.updateFlag = true;
  }

  PlotImportExportChart2(regLuzVisArray,regVisLuzArray,regMinVisArray,regMinVisMinArray){
    const regLuzVis = [];
    const regVisLuz = [];
    const regMinVis = [];
    const regVisMin = [];

    this.ImportExporteriesOptions = [];
    Object.keys(regLuzVisArray).forEach(element => {
      let val;
      if(regLuzVisArray[element].Value == null){
        val = 0
      }else{
        val = regLuzVisArray[element].Value;
      }
      regLuzVis.push([regLuzVisArray[element].TimestampLabel, val]);
    });
    Object.keys(regVisLuzArray).forEach(element => {
      let val;
      if(regVisLuzArray[element].Value == null){
        val = 0
      }else{
        val = regVisLuzArray[element].Value;
      }
      regVisLuz.push([regVisLuzArray[element].TimestampLabel,val]);
    });

    Object.keys(regMinVisArray).forEach(element => {
      let val;
      if(regMinVisArray[element].Value == null){
        val = 0
      }else{
        val = regMinVisArray[element].Value;
      }
      regMinVis.push([regMinVisArray[element].TimestampLabel, val]);
    });

    Object.keys(regMinVisMinArray).forEach(element => {
      let val;
      if(regMinVisMinArray[element].Value == null){
        val = 0
      }else{
        val = regMinVisMinArray[element].Value;
      }
      regVisMin.push([regMinVisMinArray[element].TimestampLabel, val]);
    });

    
    this.ImportExporteriesOptions.push(
      {
        name: 'LUZ-VIS',
        color: '#3df463',
        data: regLuzVis
      },
    );

    this.ImportExporteriesOptions.push(
      {
        name: 'VIS-LUZ',
        color: '#3a87ff',
        data: regVisLuz
      },
    );

    this.ImportExporteriesOptions.push(
      {
        name: 'MIN-VIS',
        color: '#ff9454',
        data: regMinVis
      },
    );

    this.ImportExporteriesOptions.push(
      {
        name: 'VIS-MIN',
        color: '#32a852',
        data: regVisMin
      },
    );

    this.ImportExportOptions.series = this.ImportExporteriesOptions;
    this.updateFlag = true;
  }

  PlotImportExportChart(regLuzArray,regVisArray,regMinArray){
    const regLuz = [];
    const regVis = [];
    const regMin = [];

    this.ImportExporteriesOptions = [];
    Object.keys(regLuzArray).forEach(element => {
      let val;
      if(isNaN(regLuzArray[element].Value) || regLuzArray[element].Value == null){
        val = 0
      }else{
        val = regLuzArray[element].Value;
      }
      regLuz.push([regLuzArray[element].TimestampLabel, val]);
    });
    Object.keys(regVisArray).forEach(element => {
      let val;
      if(isNaN(regVisArray[element].Value) || regVisArray[element].Value == null){
        val = 0
      }else{
        val = regVisArray[element].Value;
      }
      regVis.push([regVisArray[element].TimestampLabel,val]);
    });

    Object.keys(regMinArray).forEach(element => {
      let val;
      if(isNaN(regMinArray[element].Value) || regMinArray[element].Value == null){
        val = 0
      }else{
        val = regMinArray[element].Value;
      }
      regMin.push([regMinArray[element].TimestampLabel, val]);
    });

    
    this.ImportExporteriesOptions.push(
      {
        name: 'LUZ',
        color: '#3df463',
        data: regLuz
      },
    );

    this.ImportExporteriesOptions.push(
      {
        name: 'VIS',
        color: '#3a87ff',
        data: regVis
      },
    );

    this.ImportExporteriesOptions.push(
      {
        name: 'MIN',
        color: '#ff9454',
        data: regMin
      },
    );


    this.ImportExportOptions.series = this.ImportExporteriesOptions;
    this.updateFlag = true;
  }

  SetImport(val){
    this.isImport = val;
    this.GetDemand();
    this.GetPortfolioDemand();
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
      // this.PlotDemandChart(hLuzdemand,hVisdemand,hMindemand,hPricedemand);
      this.PlotDemandChart(hLuzdemand,hVisdemand,hMindemand,hPricedemand);
    });

    this.traderDashboardService.getImportExport().subscribe(data => {
      this.PlotImportExportChart(data[0]['PIValue'],data[1]['PIValue'],data[2]['PIValue']);
      // if(this.isImport){
      //   this.PlotImportExportChart(data[0]['PIValue'],data[1]['PIValue'],data[2]['PIValue']);
      // }else{
      //   this.PlotImportExportChart(data[3]['PIValue'],data[4]['PIValue'],data[5]['PIValue']);
      // }
    });
    //this.SetImportExport();
    //this.SetData();
  }

  GetPortfolioDemand(){
    let priceUnitNumber:string;
    if(this.portfolioCurrentUnitPrice.name != '' && this.portfolioCurrentUnitPrice.name != 'SELECT UNIT'){
      priceUnitNumber = this.portfolioCurrentUnitPrice.name;
    }else{
      priceUnitNumber = "";
    }


    this.traderDashboardService.getPortfolioDemand(priceUnitNumber).subscribe(data=>{
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

    this.traderDashboardService.getImportExport().subscribe(data => {
      this.PlotImportExportChart(data[0]['PIValue'],data[1]['PIValue'],data[2]['PIValue']);
      // if(this.isImport){
      //   this.PlotImportExportChart(data[0]['PIValue'],data[1]['PIValue'],data[2]['PIValue']);
      // }else{
      //   this.PlotImportExportChart(data[3]['PIValue'],data[4]['PIValue'],data[5]['PIValue']);
      // }
    });
    //this.SetImportExport();
    //this.SetData();
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

  SetReserveMarketValue(unitNumber:string){
    this.traderDashboardService.getReserveSchedules(unitNumber).subscribe(data => {
      console.log("reserve", data);
    })
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
          if(rtd[5].Actual != null && rtd[5].IsLimit == false && rtd[4].IsWithAlarm == true){
            this.alarmOutsideLimit=true;
          }
   
          if(rtd[4].DataStatus == "H"){
            this.alarmHAP = true;
          }

          if(rtd[4].DataStatus == "O"){
            this.alarmOverride = true;
          }
          this.rtdRound1 = rtd[4].Value != null ? Math.round(rtd[4].Value) : null;
          this.rtdRound2 = rtd[5].Value != null ? Math.round(rtd[5].Value) : null;
          console.log(this.rtdRound1)
          console.log(this.rtdRound2)
          if(this.rtdRound1 != this.rtdRound2){
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
        if (!this.isAlarmDisable) {
          this.timerAlarmNoConnection = setInterval(() => {
            this.NoInternetAudio();
           }, 4000);
        }
    });
  }

  userLogs(action:string){
    const data = {
      UserID: localStorage.getItem('UserID'),
      Action: action,
      ModuleID: 1
    };
    this.userService.userLogs(data).subscribe();
  }

  selectedUnit(id:number, units, currentUnit, unitType:string){
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
      // this.PlotHAPChart();
      // this.PlotDAPChart();
      this.ManualRefresh();
     
      }else{
        if(unitType == 'Price'){
          this.SetUnitPrice(currentUnit.name);
          this.userLogs('Price_Unit: ' + currentUnit.name);
        }else{
          this.SetUnitValue(currentUnit.name,unitType);
          // this.PlotHAPChart();
          // this.PlotDAPChart();
    
          this.ManualRefresh();
          //console.log('unit selected');
          this.userLogs('RTD_Unit: ' + currentUnit.name);
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
          this.userLogs('PB_Unit: ' + currentUnit.name);
      }
  }

  OpenOverridModal(content: NgbModal, unitNumber:string){
    this.selectedUnitNumber = unitNumber;
    this.traderDashboardService.getOverrideValue(unitNumber).subscribe(data => {
      let overrideValue = data;

      this.isOverride = overrideValue['IsUse'];
      this.rtdValue = overrideValue['Value'];
    });

    if(unitNumber == "13SMC_U01" || unitNumber == "13SMC_U02"){
      this.traderDashboardService.getMOTValue(unitNumber).subscribe(data => {
        let value = data;
  
        this.isMOT = value['IsUse'];
        this.MOTValue = value['Value'];
      });
    }
    
    this.userLogs('Override: ' + unitNumber + ' | value: ' +  this.rtdValue);
    
    this.modalReference = this.modalService.open(content, { size: 'sm', centered: true });
  }

  OverrideValue(){
    if(this.isOverride && this.rtdValue == null){
      return
    }

    const payload = {
      IsUse: this.isOverride,
      UnitNumber: this.selectedUnitNumber,
      Value: this.rtdValue,
      IsReserve: false
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
    });

    const payloadMOT = {
      IsUse: this.isMOT,
      UnitNumber: this.selectedUnitNumber,
      Value: this.MOTValue
    };

    if(this.selectedUnitNumber == "13SMC_U01" || this.selectedUnitNumber == "13SMC_U02"){
      this.traderDashboardService.saveMOTValue(payloadMOT).subscribe(data =>{
        if(this.isMOT){
          this.successMessage = "Unit " + this.selectedUnitNumber + " MOT value is Active";
        }else{
          this.successMessage = "Unit " + this.selectedUnitNumber + " MOT value is Inactive";
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
  }

  getCurrentInterval(interval:string){
    this.currentInterval = interval;
    return interval;
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


  ngOnDestroy() {
    
      // Unsubscribe to avoid memory leaks
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    

    clearInterval(this.timerData);
    clearInterval(this.timerDT);
    clearTimeout(this.timerAlarmOutsideLimit);
    clearInterval(this.timerAlarmHAP);
    clearInterval(this.timerAlarmNoConnection);
    this.alarmOutsideLimit=false;
    this.alarmNoconnection=false;
    this.alertMessage =null;
    this.bodyTag.classList.remove('bg-dark');
    this.unsubscribe.next();
    this.unsubscribe.complete();
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

  exportBid(log: any): void {
    const unitNumber = log.UnitNumber 
      || (this.currentUnit1 && this.currentUnit1.name) 
      || (this.currentUnitBids && this.currentUnitBids.name);
  
    // ✅ Safe fallback without optional chaining
    const baseTag = document.getElementsByTagName('base')[0];
    const baseHref = baseTag && baseTag.getAttribute('href') ? baseTag.getAttribute('href') : '/';
  
    if (!log || !log.BidHistoryID || !unitNumber) {
      console.error('Missing log, BidHistoryID, or unitNumber:', log, unitNumber);
      return;
    }
  
    const url = `${baseHref}bids-viewer-export/${log.BidHistoryID}/${unitNumber}/${log.UploadedBy}/${log.TransactionID}/${encodeURIComponent(log.DateUploaded)}/${encodeURIComponent(log.TransactionDate)}/${encodeURIComponent(log.Status)}`;
    
    window.open(url, '_blank');
  }
  
  


  viewBidLog(log: any): void {
    const url = this.buildViewerUrl(log);
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('Invalid Unit Number. Cannot open bid viewer.');
    }
  }
  
  buildViewerUrl(log: any): string {
    let unit = 'unknown';
  
    if (log && log.UnitNumber) {
      unit = log.UnitNumber;
    } else if (this.currentUnitBids && this.currentUnitBids.name) {
      unit = this.currentUnitBids.name;
    }
  
    if (!unit || unit === 'unknown' || unit === 'SELECT UNIT') {
      return '';
    }
  
    const bidHistoryId = log && log.BidHistoryID ? log.BidHistoryID : 0;
    const uploadedBy = log && log.UploadedBy ? log.UploadedBy : 'unknown';
    const transactionId = log && log.TransactionID ? log.TransactionID : 'unknown';
    const dateUploaded = log && log.DateUploaded ? log.DateUploaded : new Date().toISOString();
    const transactionDate = log && log.TransactionDate ? log.TransactionDate : new Date().toISOString();
    const status = log && log.Status ? log.Status : 'unknown';
  
    const baseElement = document.getElementsByTagName('base')[0];
    const baseHref = baseElement && baseElement.getAttribute('href') ? baseElement.getAttribute('href') : '/';
  
    return `${baseHref}bids-viewer/${bidHistoryId}/${unit}/${uploadedBy}/${transactionId}/${dateUploaded}/${transactionDate}/${status}`;
  }
  
  
  
  
  
  
  
  
  

  // viewBidLog(log: any): void {
  //   let unit: string = '';
  
  //   if (log && log.UnitNumber) {
  //     unit = log.UnitNumber;
  //   } else if (this.currentUnit1 && this.currentUnit1.name) {
  //     unit = this.currentUnit1.name;
  //   }
  
  //   if (log && log.BidHistoryID && unit) {
  //     this.router.navigate([
  //       '/bids-viewer',
  //       log.BidHistoryID,
  //       unit,
  //       log.UploadedBy || 'unknown',
  //       log.TransactionID || 'unknown',
  //       log.DateUploaded || moment().toISOString(),
  //       log.TransactionDate || moment().toISOString()
  //     ]);
  //   } else {
  //     console.error('Missing BidHistoryID or UnitNumber:', log);
  //     alert('Incomplete log entry.');
  //   }
  // }
  
  
  
  
  
  
  
  
  // selectedLogsUnit(id:number,units, currentUnit, unitType:string){
  //   const selected = units.find(unit => unit.UnitID === id);
  //   const date = Highcharts.dateFormat
  //   currentUnit.id = selected.UnitID;
  //   currentUnit.name = selected.UnitNumber; 

  //   if(currentUnit.name=='SELECT UNIT'){

  //     console.log(unitType +"UnitNUmber" == null)

  //      }else{
  //       this.traderDashboardService.getBidLogsHistory(currentUnit.name,unitType).subscribe(data=>
  //         {
  //           console.log('Logs_Unit: ' + currentUnit.name);
  //           console.log('Selected date:', this.selectedDate);
  //         });
          
  //     }
  // }

  // selectedLogsUnit(id: number, units: any[], currentUnit: any): void {
  //   const selected = units.find(unit => unit.UnitID === id);
  //   if (selected) {
  //     currentUnit.id = selected.UnitID;
  //     currentUnit.name = selected.UnitNumber;
  //     this.currentUnit1 = currentUnit;
  //     this.BidLogsHistory();
  //   }
  // }

  // onDateChange(): void {
  //   this.BidLogsHistory();
  // }

  // BidLogsHistory(): void {
  //   if (this.currentUnit1.name !== '' && this.selectedDate) {
  //     this.traderDashboardService
  //       .getBidLogsHistory(this.currentUnit1.name, this.selectedDate)
  //       .subscribe(data => {
  //         console.log('Logs_Unit:', this.currentUnit1.name);
  //         console.log('Selected date:', this.selectedDate);
  //       });
  //   }
  // }
  selectedLogsUnit(id: number, units: any[], currentUnit: any): void {
    const selected = units.find(unit => unit.UnitID === id);
    if (selected) {
      const clone = { id: selected.UnitID, name: selected.UnitNumber };
      this.currentUnitBids = clone;
  
      if (clone.name !== 'SELECT UNIT' && this.selectedDate) {
        this.BidLogsHistory();
      }
    }
  }
  
  onDateChange(): void {
    if (this.currentUnitBids.name && this.currentUnitBids.name !== 'SELECT UNIT' && this.selectedDate) {
      this.BidLogsHistory();
    }
  }
  
  BidLogsHistory(): void {
    if (this.currentUnitBids.name !== '' && this.selectedDate) {
      this.loading = true;
      this.traderDashboardService
        .getBidLogsHistory(this.currentUnitBids.name, this.selectedDate)
        .subscribe({
          next: (res: any) => {
            this.bidLogs = res.data ? res.data : res;
            this.loading = false;
          },
          error: (err) => {
            console.error('Bid log fetch error:', err);
            this.bidLogs = [];
            this.loading = false;
          }
        });
    }
  }
  
  







}
