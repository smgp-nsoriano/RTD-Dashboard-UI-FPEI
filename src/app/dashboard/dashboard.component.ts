import { Component, OnInit, OnDestroy,ViewChild,ChangeDetectorRef} from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import { DashboardService } from './dashboard.service';
import * as moment from 'moment';
import { interval, Subject } from 'rxjs';
import { UsersService } from '../users/users.service';
import { faClock, faTimesCircle,faRetweet } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

declare const require;

require('highcharts/modules/no-data-to-display')(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit, OnDestroy{

  @ViewChild('alarmModal') alarmModal : any;

  private unsubscribe: Subject<any> = new Subject();
  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
  now:any;

  DAPHour:any;

  HADseriesOptions = [];
  DAHseriesOptions = [];
  updateFlag = true;
  isOperator: boolean;
  permissionID: any;
  errorMessage:any;
  operatorUnit;
  faClock=faClock;
  faTimesCircle=faTimesCircle;
  Highcharts = Highcharts;
  faRetweet = faRetweet;
  HADOptions = {
    title: '',
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Roboto Condensed'
      }
    },

    rangeSelector: {
      buttons: [
        {
          count: 30,
          type: 'minute',
          text: '30M'
        },
        {
          count: 1,
          type: 'hour',
          text: '1H'
        },
        {
          count: 1,
          type: 'day',
          text: '1D'
        }
      ],
      selected: 3,
      allButtonsEnabled: true,
      inputEnabled: false
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

  chartOptions = {         
    chart : {
       zoomType: 'xy',
       backgroundColor: 'transparent',
       style: {
         fontFamily: 'Roboto Condensed'
       }
    },
    
    title : {
       text: ''   
    },   
    
    xAxis : {
       categories: ['01', '02', '03', '04', '05', '06',
               '07', '08', '09', '10', '11', '12','13','14','15','16','17','18','19','20','21','22','23','24'],
       crosshair: true
    },
    yAxis : [
       { // Primary yAxis
          labels: {
             format: '{value}\xB0C',
             style: {
                color: Highcharts.getOptions().colors[0]
             }
          },
          title: {
             text: 'Price',
             style: {
                color: Highcharts.getOptions().colors[0]
             }
          },
          opposite: true
       }, 
       { // Secondary yAxis
          title: {
             text: 'RTD',
             style: {
                color: Highcharts.getOptions().colors[2]
             }
          },
          labels: {
             format: '{value} mm',
             style: {
                color: Highcharts.getOptions().colors[2]
             }
          }
       },
       { // Tertiary yAxis
          gridLineWidth: 0,
          title: {
             text: 'Actual',
             style: {
                color: Highcharts.getOptions().colors[3]
             }
          },
          labels: {
             format: '{value} mb',
             style: {
                color: Highcharts.getOptions().colors[3]
             }
          },
          opposite:true  
       }
    ],
    tooltip: {
       shared: true
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
    series : [
       {
          name: 'RTD',
          type: 'line',
          yAxis: 1,
          data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,
                  216.4, 194.1, 95.6, 54.4,49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,
                  216.4, 194.1, 95.6, 54.4],
          tooltip: {
             valueSuffix: ' MW'
          }
       }, 
       {
          name: 'PRICE',
          type: 'line',
          yAxis: 2,
          data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2,
                   1013.1, 1016.9, 1018.2, 1016.7],
          tooltip: {
          valueSuffix: ' Php'
          }
       },
       {
          name: 'Actual',
          type: 'line',
          data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
          tooltip: {
             valueSuffix: ' MW'
          }
       }
    ]
 };

  currentDap = true;

  forecasts;
  pasts;
  current;

  sites;
  units;

  currentSite = {
    name: '',
    id: ''
  };

  currentUnit = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  };

  timerData: any;
  timerClock: any;
  timerDCS:any;
  timerAlarm:any;
  checkIsLimit:boolean;
  isAcknowledgeAlarm:boolean;
  isWithAlarm:boolean;
  isWithDecimal:boolean;
  IsNetLoad: boolean
  currentUserInfo;
  modalRef: NgbModalRef;
  alarmMessage: string;
  alarmRTDMessage:string;
  blinkerTimer:any;



  isRTDBlinking:boolean;

    // Blink flags for each box
  isRRUBlinking = false;
  isRRDBlinking = false;
  isContingencyBlinking = false;
  testMode: boolean = false; // set to false in production
  isPlayingAudio: boolean = false;
  // Previous values
  previousRRU: number | null = null;
  previousRRD: number | null = null;
  previousContingency: number | null = null;

  shouldBlinkRRU: boolean = false;
  shouldBlinkRRD: boolean = false;
  shouldBlinkContingency: boolean = false;
  blinkerRRUTimer: any;
  blinkerRRDTimer: any;
  blinkerContingencyTimer: any;

  isBat:boolean;

  order: string = 'TimeStamp';
  constructor(private dashboardService: DashboardService,
    private cdRef: ChangeDetectorRef,
    private userService: UsersService,
    private modalService: NgbModal,
    private router: Router,
    config: NgbModalConfig) { 
    config.backdrop = 'static';
    config.keyboard = false;
    }

  ngOnInit() {
    this.IsNetLoad = false;
    this.isWithDecimal = false; 
    this.bodyTag.classList.add('bg-dark');
    this.now = moment("","MM/DD/YYYY HH:mm:ss");
    this.current = [];
    this.pasts = [];
    this.forecasts = [];
    this.getData();
    this.SetTimeFromServer();
    
    // setInterval(() => {
    //   clearInterval(this.blinkerRRUTimer);
    //   this.blinkerRRUTimer = setInterval(() => {
    //     this.isRRUBlinking = !this.isRRUBlinking;
    //     console.log('TEST BLINK:', this.isRRUBlinking);
    //   }, 1000); // toggle every second
  
    //   // stop toggling after 10s
    //   setTimeout(() => {
    //     clearInterval(this.blinkerRRUTimer);
    //     this.isRRUBlinking = false;
    //   }, 10000);
    // }, 15000); // rerun blinking cycle every 15s
    // interval(1000).subscribe(() => {
    //  this.setData();
    // });

    interval(9000).subscribe(() => {
      this.SetTimeFromServer();
    });
    
    //interval(30000)
    //.pipe(takeUntil(this.unsubscribe))
    //.subscribe(() => {
    //  this.getData();
    //});
    this.getCurrentUserInfo();

  }

  FormatClock(){
    return this.now.format('MMMM DD, YYYY HH:mm:ss');
  }

  SetTimeFromServer(){
    this.dashboardService.getDT().subscribe(data=>{
      clearInterval(this.timerData);
      clearInterval(this.timerClock);
      this.timerSetClock(data.toString());
      this.timerGetData();
    });
}

  timerSetClock(dt:string){
    this.now = moment(dt,"MM/DD/YYYY HH:mm:ss");
    this.timerClock = setInterval(() => {
      this.now.add(1, 'second');
      this.setData();
    }, 1000);
  }

  timerGetData() {
  // Track whether any of the three changed
  let hasAnyChange = false;
  this.timerData = setInterval(() => {
    if (+moment(this.now).second() === 4) {
      this.getData();
    }
    // console.log(this.current['RRU'],"->",this.pasts[5]['RRU'])
    // console.log(this.current['RRD'],"->",this.pasts[5]['RRD'])
    // console.log(this.current['Contigency'],"->",this.pasts[5]['Contigency'])
    if (+moment(this.now).minute() % 5 === 0 && +moment(this.now).second() === 7) {

      // === RTD (Energy) ===
      if (this.current['RTDValue'] != null && this.pasts[5]['RTDValue'] != null) {
        if (this.current['RTDValue'] !== this.pasts[5]['RTDValue']) {
          console.log(this.current['RTDValue'] ,"->", this.pasts[5]['RTDValue'])
          this.alarmRTDMessage = "RTD has changed!";
          hasAnyChange = true;
          clearInterval(this.blinkerTimer); // clear if already running
          this.blinkerTimer = setInterval(() => {
            this.isRTDBlinking = +moment(this.now).second() % 2 === 1;
            console.log('RTD has changed', this.currentUnit.name, ':', this.isRTDBlinking);
          }, 1000);
          this.timerAlarm = setTimeout(() => {
            clearInterval(this.blinkerTimer);
            this.isRTDBlinking = false;
            this.stopAlarm();
          }, 60000); // 1 minute
        } else {
          clearInterval(this.blinkerTimer);
          this.isRTDBlinking = false;
          this.stopAlarm();
        }
      }
      // === RR-UP (RRU) ===
      if (this.current['RRU'] !== this.pasts[5]['RRU']) {
        console.log(this.current['RRU'],"->",this.pasts[5]['RRU'])
        hasAnyChange = true;
        clearInterval(this.blinkerRRUTimer);
        this.blinkerRRUTimer = setInterval(() => {
          this.isRRUBlinking = !this.isRRUBlinking;
          this.cdRef.detectChanges();
        }, 1000);

        setTimeout(() => {
          clearInterval(this.blinkerRRUTimer);
          this.isRRUBlinking = false;
          this.cdRef.detectChanges();
        }, 30000);
      }

      // === RR-DOWN (RRD) ===
      if (this.current['RRD'] !== this.pasts[5]['RRD']) {
        console.log(this.current['RRD'],"->",this.pasts[5]['RRD'])
        hasAnyChange = true;
        clearInterval(this.blinkerRRDTimer);
        this.blinkerRRDTimer = setInterval(() => {
          this.isRRDBlinking = !this.isRRDBlinking;
          this.cdRef.detectChanges();
        }, 1000);

        setTimeout(() => {
          clearInterval(this.blinkerRRDTimer);
          this.isRRDBlinking = false;
          this.cdRef.detectChanges();
        }, 30000);
      }

      // === Contingency ===
      if (this.current['Contingency'] !== this.pasts[5]['Contingency']) {
        console.log(this.current['Contingency'],"->",this.pasts[5]['Contingency'])
        hasAnyChange = true;
        clearInterval(this.blinkerContingencyTimer);
        this.blinkerContingencyTimer = setInterval(() => {
          this.isContingencyBlinking = !this.isContingencyBlinking;
          this.cdRef.detectChanges();
        }, 1000);

        setTimeout(() => {
          clearInterval(this.blinkerContingencyTimer);
          this.isContingencyBlinking = false;
          this.cdRef.detectChanges();
        }, 30000);
      }

      // Play alarm once if ANY changed
      if (hasAnyChange) {
        this.alarmRTDMessage = "RTD has changed!";
        if (!this.isPlayingAudio) {
          this.isPlayingAudio = true;
          this.RTDChangedAudio();
          setTimeout(() => this.isPlayingAudio = false, 3000);
        }
      }
    }
  }, 1000); // Every second
}

  

  ManualRefresh(){
    this.SetTimeFromServer();
    this.getData();
  }

  stopAlarm(){
    this.alarmRTDMessage = null;
    clearInterval(this.blinkerTimer);
    this.isRTDBlinking = false;
    this.isContingencyBlinking = false;
    this.isRRUBlinking=false;
    this.isRRDBlinking = false;
    clearInterval(this.timerAlarm);
  }

  OpenAlarmModal(){
    if(!this.modalService.hasOpenModals()){
      this.playAudio();
      this.modalRef = this.modalService.open(this.alarmModal);
    }
  }

  OpenDRTAlarmModal(){
    if(!this.modalService.hasOpenModals()){
        this.modalRef = this.modalService.open(this.alarmModal);
        this.timerAlarm = setInterval(() => {
          this.playAudio();
        },3000);
      }
  }


  // // current unit available for current net load
  // private readonly netloadUnits = ['01MSINLO_G01', '01MSINLO_G02', '01MSINLO_G03'];
  // isNetloadUnit(): boolean {
  //   return this.netloadUnits.includes(this.currentUnit.name);
  // }
  // getNetLoadHeight(): string {
  //   return this.isNetloadUnit() ? '120px' : '0px';
  // }

 isNetloadUnit(): boolean {
    return this.IsNetLoad;
  }

  getNetLoadHeight(): string {
    return this.IsNetLoad ? '120px' : '0px';
  } 

  getData() {

    this.dashboardService.checkConnection().subscribe(data=>{
      data;
      this.alarmRTDMessage = null;
    },error=>{
      error;
      this.stopAlarm();
      this.alarmRTDMessage = "Connection to server problem.";
    });

    this.dashboardService.getCurrentRTD(+this.currentSite.id, +this.currentUnit.id).subscribe(data => {
      
      if (!data || Object.keys(data).length === 0) {
        this.current = null;
        return;
      }
      
      
      
      // Store previous values before updating
      const prevRRU = this.previousRRU;
      const prevRRD = this.previousRRD;
      const prevContingency = this.previousContingency;
    
      this.current = data;
    
      // If in test mode, override with mock values
      if (this.testMode) {
        this.current.RTDValue = Math.floor(Math.random() * 200); // simulate MW value
        this.current.RRU = Math.floor(Math.random() * 100);
        this.current.RRD = Math.floor(Math.random() * 100);
        this.current.Contingency = Math.floor(Math.random() * 100);
        console.log('Test Mode ON - Mock Values:', this.current);
      }
    
      // Apply blinking state if values changed
      this.isRRUBlinking = prevRRU !== null && this.current.RRU !== prevRRU;
      this.isRRDBlinking = prevRRD !== null && this.current.RRD !== prevRRD;
      this.isContingencyBlinking = prevContingency !== null && this.current.Contingency !== prevContingency;
    
      if (this.isRRUBlinking) {
        setTimeout(() => this.isRRUBlinking = false, 20000);
      }
      if (this.isRRDBlinking) {
        setTimeout(() => this.isRRDBlinking = false, 20000);
      }
      if (this.isContingencyBlinking) {
        setTimeout(() => this.isContingencyBlinking = false, 20000);
      }
    
      // Debugging logs
      // console.log('RRU Blink:', this.isRRUBlinking, 'Current:', this.current.RRU, 'Prev:', prevRRU);
      // console.log('RRD Blink:', this.isRRDBlinking, 'Current:', this.current.RRD, 'Prev:', prevRRD);
      // console.log('Contingency Blink:', this.isContingencyBlinking, 'Current:', this.current.Contingency, 'Prev:', prevContingency);
    
      // Update previous values
      this.previousRRU = this.current.RRU;
      this.previousRRD = this.current.RRD;
      this.previousContingency = this.current.Contingency;
    
      // Alarm and flag logic
      if (this.current) {
        this.isWithAlarm = this.current.IsWithAlarm;
        this.isWithDecimal = this.current.IsWithDecimal;
        this.IsNetLoad = this.current.IsNetLoad;
    
        if (this.current.DataStatus === "H") {
          this.stopAlarm();
          this.alarmRTDMessage = "HAP is in use.";
          this.HAPAudio();
          this.OpenAlarmModal();
          this.timerAlarm = setInterval(() => {
            this.stopAlarm();
          }, 5000);
        } else if (this.current.DataStatus === "O") {
          this.stopAlarm();
          this.alarmRTDMessage = "Override value is in use.";
          this.OverrideAudio();
          this.OpenAlarmModal();
          this.timerAlarm = setInterval(() => {
            this.stopAlarm();
          }, 5000);
        }
      } else {
        this.isWithAlarm = false;
        this.isWithDecimal = false;
        this.IsNetLoad = false;
      }
    
    }, error => {
      console.log(error.message);
      this.alarmRTDMessage = "Connection to server problem.";
      this.IsNetLoad = false;
      this.current = { RRU: null, RRD: null, Contingency: null }; // Use empty fallback
    });
    
    
    

    this.dashboardService.getAheadRTD(+this.currentSite.id, +this.currentUnit.id).subscribe(data => {
      this.forecasts = data;
    }, error => {
      console.log(error.message);
    });

    this.dashboardService.getPastTime(+this.currentSite.id, +this.currentUnit.id).subscribe(data => {
      this.pasts = data;
      
      //&& this.pasts[5].ActualValue != null
      if (this.pasts && this.pasts.length > 5 && this.pasts[5] != null) {
        if (this.pasts[5].IsLimit === false && this.pasts[5].ActualValue != null) {
          this.stopAlarm();
          if (this.isWithAlarm) {
            this.alarmRTDMessage = "Actual MW, outside the limits";
            this.OutsideLimitAudio();
            this.OpenAlarmModal();
            this.timerAlarm = setInterval(() => {
              this.stopAlarm();
            }, 5000);
          }
        }
      }
    }, error => {
      console.log(error.message);
      this.alarmRTDMessage = "Connection to server problem.";
    });

    if (+this.currentSite.id !== 0 && +this.currentUnit.id !== 0) {
      this.dashboardService.getHAP(+this.currentSite.id, +this.currentUnit.id)
      .pipe(first())
      .subscribe(data => {
        const rtd = [];
        const price = [];
        const actual = [];

        Object.keys(data).forEach(element => {
          rtd.push([data[element].DateTIme, data[element].RTDValue]);
          actual.push([data[element].DateTIme, data[element].ActualValue]);

          if (this.currentUserInfo.IsShowPrice === true) {
            price.push([data[element].DateTIme, data[element].PriceValue]);
          } else {
            price.push([data[element].DateTIme, null]);
          }
        });

        this.HADseriesOptions = [];

        this.HADseriesOptions.push(
          {
            name: 'HAP',
            color: 'yellow',
            data: rtd
          },
        );
      });

      this.dashboardService.getDAP(+this.currentSite.id, +this.currentUnit.id, this.currentDap)
      .subscribe(data => {
        const rtd = [];
        const actual = [];
        const price = [];
        this.DAPHour = data[1]['DAPHour'];
        
        Object.keys(data).forEach(element => {
          
          rtd.push([data[element].DAPHour, data[element].RTDValue]);
          actual.push([data[element].DAPHour, data[element].ActualValue]);

          if (this.currentUserInfo.IsShowPrice === true) {
            price.push([data[element].DAPHour, data[element].PriceValue]);
          } else {
            price.push([data[element].DAPHour, null]);
          }
        });

        this.DAHseriesOptions = [];

        this.DAHseriesOptions.push(
          {
            name: 'DAP',
            color: 'yellow',
            data: rtd,
          });
      });
    }
  }

  setData() {
    this.HADOptions.series = this.HADseriesOptions;
    this.DAHOptions.series = this.DAHseriesOptions;
    this.chartOptions;
    this.updateFlag = true;
  }

  formatDate(date: string) {
    if (typeof date === 'undefined' || date === null) {
      return;
    }
    return moment(date).format('HH:mm');
  }

  currentTime(timestamp: string) {
    const minute = moment(timestamp).format('mm');
    const current = +moment().format('mm');
    const mod = +current % 5;
    const result = current - mod;

    if (result.toString().length === 1) {
      return moment().format('HH:0') + result;
    }

    return moment().format('HH:') + result;
  }

  selectedSite(id: number, operator: boolean) {
    
    if(!operator){
      const selected = this.sites.find(site => site.SiteID === id);

      this.currentSite.id = selected.SiteID;
      this.currentSite.name = selected.SiteName;
    }
    

    this.dashboardService.getUnitList(+this.currentSite.id).subscribe(data => {
      this.units = data;
    }, error => {
      console.log(error);
    });

    this.currentUnit.id = '';
    this.currentUnit.name = '';
    this.current = {};
    this.forecasts = [];
    this.pasts = [];
  }

  selectedUnit(id: number, operator: boolean, unit) {
    this.isOperator = operator;
    if(!operator){
      const selected = this.units.find(unit => unit.UnitID === id);

      this.currentUnit.id = selected.UnitID;
      this.currentUnit.name = selected.UnitNumber; 
      this.currentUnit.bColor = selected.BColor;
      this.currentUnit.fColor = selected.FColor;
    }else{
      this.currentUnit.id = unit.UnitID;
      this.currentUnit.name = unit.UnitNumber;
      this.currentUnit.bColor = unit.BColor;
      this.currentUnit.fColor = unit.FColor;
      this.currentSite.id = unit.SiteID;
      this.currentSite.name = unit.SiteCode;
    }
    this.getData();
   
    this.setData();
  }

  getCurrentUserInfo() {
    this.userService.getCurrentUserInfo().subscribe(info => {
      this.currentUserInfo = info;
      
      this.permissionID = +this.currentUserInfo.PermissionID;
      
      if(this.currentUserInfo.IsOperator){
        this.dashboardService.getOperatorUnit(this.permissionID).subscribe(data=>{
          this.operatorUnit = data;
          this.currentUnit.name = this.operatorUnit.UnitNumber;
          this.currentUnit.id = this.operatorUnit.UnitID;
          this.currentUnit.bColor = this.operatorUnit.BColor;
          this.currentUnit.fColor = this.operatorUnit.FColor;
          this.currentSite.id = this.operatorUnit.SiteID;
          this.currentSite.name = this.operatorUnit.SiteCode;
          //this.selectedSite(+this.operatorUnit.SiteID, true);
          this.selectedUnit(+this.operatorUnit.UnitID, true, this.operatorUnit);
          //console.log(this.operatorUnit);

          this.isBat = (this.operatorUnit.UnitNumber.includes("BAT") || this.operatorUnit.UnitNumber === '13SMC_U01' || this.operatorUnit.UnitNumber === '13SMC_U02')
        });
      }else{
        this.dashboardService.getSiteList(this.permissionID).subscribe(data => {
          this.sites = data;
        }, error => {
          console.log(error.message);
        });
  
        this.dashboardService.getUnitList(+this.currentSite.id).subscribe(data => {
          this.units = data;
        }, error => {
          console.log(error.message);
        });
      }
      
    }, error => {
      console.log(error.message);
    });
  }

  filterDap(current: boolean) {
    this.currentDap = current;

    this.getData();
    this.setData();
  }

  ngOnDestroy() {
    //clearInterval(this.timerData);
    this.bodyTag.classList.remove('bg-dark');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  playAudio(){
    let audio = new Audio();
    audio.src = "assets/audio/alarm.wav";
    audio.load();
    audio.play();
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

  getDecimal(number: number): string {
    // this does not work for xx.0x (example 118.09 turns into 118.9)
    // const decimalPart = Math.abs(number - Math.floor(number));
    // const decimalOnly = Number(decimalPart.toFixed(2).slice(2));
    // return decimalOnly;

    const decimalPart = number % 1;
    const decimalOnly = Number(decimalPart.toFixed(2)).toString();
    const decimal_parts = decimalOnly.split(".")
    if (decimal_parts[1]){
      return decimal_parts[1]
    } else {
      return "0"
    }
  }

  getWholeNumber(number: number): number {
    const wholeNumber: number = Math.trunc(number);
    return wholeNumber;
  }
}
