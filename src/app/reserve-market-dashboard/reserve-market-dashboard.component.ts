import { Component, OnInit,OnDestroy, AfterViewInit} from '@angular/core';
import * as moment from 'moment';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../users/users.service';
import { ReserveMarketDashboardServiceService } from './reserve-market-dashboard-service.service';
import { EventService } from '../trader-dashboard/EventService';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { keys } from 'highcharts';
@Component({
  selector: 'app-reserve-market-dashboard',
  templateUrl: './reserve-market-dashboard.component.html',
  styleUrls: ['./reserve-market-dashboard.component.scss'],
})
export class ReserveMarketDashboardComponent implements OnInit, OnDestroy,AfterViewInit{
  private destroy$ = new Subject<void>();
   constructor(private eventService: EventService,private RMDashboardService: ReserveMarketDashboardServiceService, private userService: UsersService, private modalService: NgbModal,) { }
   isAlarmDisable:boolean;
  tempValue: any;
  timeoutId:any;
  isWithAlarmDisable:string;
  alarmOutsideLimit: boolean;
  alarmNoconnection:boolean;
  alarmRTDChanged:boolean;
  alarmTriggered:boolean
  alarmHAP:boolean;
  alarmOverride:boolean;
  timerAlarmOutsideLimit:any;
  timerAlarmNoConnection:any;
  timerAlarmHAP:any;

  previewCleared = false;
  private lastClearedMinute: number | null = null;


  ENtempStorage1: number;
  ENtempStorage2: number;
  RUtempStorage1: number;
  RUtempStorage2: number;
  RDtempStorage1: number;
  RDtempStorage2: number;
  FRtempStorage1: number;
  FRtempStorage2: number;

  dashboardType:string;
  isShowBid
  alertMessage:string;
  currentTimestamp
  timerData
  timerClock
  timerDT
  now
  inSessionStore
  selectedUnitNumber
  isOverride = {
    ru: false,
    rd: false,
    cr: false,
    en: false,
    dr: false
  }
  overrideValues = {
    ru: null,
    rd: null,
    cr: null,
    en: null,
    dr: null
  }
  isOverrideShow = 'false'
  successMessage
  modalReference: NgbModalRef;
  timerMessage;
  inSessionStorePrice
  showU1DRcolumn = false
  showU2DRcolumn = false
  showU3DRcolumn = false
  dbValues =[
    {"TimestampLabel": "00:00", "U1ENPrice": null, "RURMPrice": null, "U2ENPrice": null, "RDRMPrice": null, "U3ENPrice": null, "CRRMPrice": null, "RMU1_EN_Sched": null, "RMU2_EN_Sched": null, "RMU3_EN_Sched": null, "RMU1_RU_Sched": null, "RMU2_RU_Sched": null, "RMU3_RU_Sched": null, "RMU1_RD_Sched": null, "RMU2_RD_Sched": null, "RMU3_RD_Sched": null, "RMU1_FR_Sched": null, "RMU2_FR_Sched": null, "RMU3_FR_Sched": null, "RMU1_DR_Sched": null, "RMU2_DR_Sched": null, "RMU3_DR_Sched": null, "RMU1_Actual_Sched": null, "RMU2_Actual_Sched": null, "RMU3_Actual_Sched": null },
    {"TimestampLabel": "00:00", "U1ENPrice": null, "RURMPrice": null, "U2ENPrice": null, "RDRMPrice": null, "U3ENPrice": null, "CRRMPrice": null, "RMU1_EN_Sched": null, "RMU2_EN_Sched": null, "RMU3_EN_Sched": null, "RMU1_RU_Sched": null, "RMU2_RU_Sched": null, "RMU3_RU_Sched": null, "RMU1_RD_Sched": null, "RMU2_RD_Sched": null, "RMU3_RD_Sched": null, "RMU1_FR_Sched": null, "RMU2_FR_Sched": null, "RMU3_FR_Sched": null, "RMU1_DR_Sched": null, "RMU2_DR_Sched": null, "RMU3_DR_Sched": null, "RMU1_Actual_Sched": null, "RMU2_Actual_Sched": null, "RMU3_Actual_Sched": null },
    {"TimestampLabel": "00:00", "U1ENPrice": null, "RURMPrice": null, "U2ENPrice": null, "RDRMPrice": null, "U3ENPrice": null, "CRRMPrice": null, "RMU1_EN_Sched": null, "RMU2_EN_Sched": null, "RMU3_EN_Sched": null, "RMU1_RU_Sched": null, "RMU2_RU_Sched": null, "RMU3_RU_Sched": null, "RMU1_RD_Sched": null, "RMU2_RD_Sched": null, "RMU3_RD_Sched": null, "RMU1_FR_Sched": null, "RMU2_FR_Sched": null, "RMU3_FR_Sched": null, "RMU1_DR_Sched": null, "RMU2_DR_Sched": null, "RMU3_DR_Sched": null, "RMU1_Actual_Sched": null, "RMU2_Actual_Sched": null, "RMU3_Actual_Sched": null },
    {"TimestampLabel": "00:00", "U1ENPrice": null, "RURMPrice": null, "U2ENPrice": null, "RDRMPrice": null, "U3ENPrice": null, "CRRMPrice": null, "RMU1_EN_Sched": null, "RMU2_EN_Sched": null, "RMU3_EN_Sched": null, "RMU1_RU_Sched": null, "RMU2_RU_Sched": null, "RMU3_RU_Sched": null, "RMU1_RD_Sched": null, "RMU2_RD_Sched": null, "RMU3_RD_Sched": null, "RMU1_FR_Sched": null, "RMU2_FR_Sched": null, "RMU3_FR_Sched": null, "RMU1_DR_Sched": null, "RMU2_DR_Sched": null, "RMU3_DR_Sched": null, "RMU1_Actual_Sched": null, "RMU2_Actual_Sched": null, "RMU3_Actual_Sched": null },
    {"TimestampLabel": "00:00", "U1ENPrice": null, "RURMPrice": null, "U2ENPrice": null, "RDRMPrice": null, "U3ENPrice": null, "CRRMPrice": null, "RMU1_EN_Sched": null, "RMU2_EN_Sched": null, "RMU3_EN_Sched": null, "RMU1_RU_Sched": null, "RMU2_RU_Sched": null, "RMU3_RU_Sched": null, "RMU1_RD_Sched": null, "RMU2_RD_Sched": null, "RMU3_RD_Sched": null, "RMU1_FR_Sched": null, "RMU2_FR_Sched": null, "RMU3_FR_Sched": null, "RMU1_DR_Sched": null, "RMU2_DR_Sched": null, "RMU3_DR_Sched": null, "RMU1_Actual_Sched": null, "RMU2_Actual_Sched": null, "RMU3_Actual_Sched": null },
    {"TimestampLabel": "00:00", "U1ENPrice": null, "RURMPrice": null, "U2ENPrice": null, "RDRMPrice": null, "U3ENPrice": null, "CRRMPrice": null, "RMU1_EN_Sched": null, "RMU2_EN_Sched": null, "RMU3_EN_Sched": null, "RMU1_RU_Sched": null, "RMU2_RU_Sched": null, "RMU3_RU_Sched": null, "RMU1_RD_Sched": null, "RMU2_RD_Sched": null, "RMU3_RD_Sched": null, "RMU1_FR_Sched": null, "RMU2_FR_Sched": null, "RMU3_FR_Sched": null, "RMU1_DR_Sched": null, "RMU2_DR_Sched": null, "RMU3_DR_Sched": null, "RMU1_Actual_Sched": null, "RMU2_Actual_Sched": null, "RMU3_Actual_Sched": null },
    {"TimestampLabel": "00:00", "U1ENPrice": null, "RURMPrice": null, "U2ENPrice": null, "RDRMPrice": null, "U3ENPrice": null, "CRRMPrice": null, "RMU1_EN_Sched": null, "RMU2_EN_Sched": null, "RMU3_EN_Sched": null, "RMU1_RU_Sched": null, "RMU2_RU_Sched": null, "RMU3_RU_Sched": null, "RMU1_RD_Sched": null, "RMU2_RD_Sched": null, "RMU3_RD_Sched": null, "RMU1_FR_Sched": null, "RMU2_FR_Sched": null, "RMU3_FR_Sched": null, "RMU1_DR_Sched": null, "RMU2_DR_Sched": null, "RMU3_DR_Sched": null, "RMU1_Actual_Sched": null, "RMU2_Actual_Sched": null, "RMU3_Actual_Sched": null },
    {"TimestampLabel": "00:00", "U1ENPrice": null, "RURMPrice": null, "U2ENPrice": null, "RDRMPrice": null, "U3ENPrice": null, "CRRMPrice": null, "RMU1_EN_Sched": null, "RMU2_EN_Sched": null, "RMU3_EN_Sched": null, "RMU1_RU_Sched": null, "RMU2_RU_Sched": null, "RMU3_RU_Sched": null, "RMU1_RD_Sched": null, "RMU2_RD_Sched": null, "RMU3_RD_Sched": null, "RMU1_FR_Sched": null, "RMU2_FR_Sched": null, "RMU3_FR_Sched": null, "RMU1_DR_Sched": null, "RMU2_DR_Sched": null, "RMU3_DR_Sched": null, "RMU1_Actual_Sched": null, "RMU2_Actual_Sched": null, "RMU3_Actual_Sched": null },
    {"TimestampLabel": "00:00", "U1ENPrice": null, "RURMPrice": null, "U2ENPrice": null, "RDRMPrice": null, "U3ENPrice": null, "CRRMPrice": null, "RMU1_EN_Sched": null, "RMU2_EN_Sched": null, "RMU3_EN_Sched": null, "RMU1_RU_Sched": null, "RMU2_RU_Sched": null, "RMU3_RU_Sched": null, "RMU1_RD_Sched": null, "RMU2_RD_Sched": null, "RMU3_RD_Sched": null, "RMU1_FR_Sched": null, "RMU2_FR_Sched": null, "RMU3_FR_Sched": null, "RMU1_DR_Sched": null, "RMU2_DR_Sched": null, "RMU3_DR_Sched": null, "RMU1_Actual_Sched": null, "RMU2_Actual_Sched": null, "RMU3_Actual_Sched": null },
    {"TimestampLabel": "00:00", "U1ENPrice": null, "RURMPrice": null, "U2ENPrice": null, "RDRMPrice": null, "U3ENPrice": null, "CRRMPrice": null, "RMU1_EN_Sched": null, "RMU2_EN_Sched": null, "RMU3_EN_Sched": null, "RMU1_RU_Sched": null, "RMU2_RU_Sched": null, "RMU3_RU_Sched": null, "RMU1_RD_Sched": null, "RMU2_RD_Sched": null, "RMU3_RD_Sched": null, "RMU1_FR_Sched": null, "RMU2_FR_Sched": null, "RMU3_FR_Sched": null, "RMU1_DR_Sched": null, "RMU2_DR_Sched": null, "RMU3_DR_Sched": null, "RMU1_Actual_Sched": null, "RMU2_Actual_Sched": null, "RMU3_Actual_Sched": null },
    {"TimestampLabel": "00:00", "U1ENPrice": null, "RURMPrice": null, "U2ENPrice": null, "RDRMPrice": null, "U3ENPrice": null, "CRRMPrice": null, "RMU1_EN_Sched": null, "RMU2_EN_Sched": null, "RMU3_EN_Sched": null, "RMU1_RU_Sched": null, "RMU2_RU_Sched": null, "RMU3_RU_Sched": null, "RMU1_RD_Sched": null, "RMU2_RD_Sched": null, "RMU3_RD_Sched": null, "RMU1_FR_Sched": null, "RMU2_FR_Sched": null, "RMU3_FR_Sched": null, "RMU1_DR_Sched": null, "RMU2_DR_Sched": null, "RMU3_DR_Sched": null, "RMU1_Actual_Sched": null, "RMU2_Actual_Sched": null, "RMU3_Actual_Sched": null },
    {"TimestampLabel": "00:00", "U1ENPrice": null, "RURMPrice": null, "U2ENPrice": null, "RDRMPrice": null, "U3ENPrice": null, "CRRMPrice": null, "RMU1_EN_Sched": null, "RMU2_EN_Sched": null, "RMU3_EN_Sched": null, "RMU1_RU_Sched": null, "RMU2_RU_Sched": null, "RMU3_RU_Sched": null, "RMU1_RD_Sched": null, "RMU2_RD_Sched": null, "RMU3_RD_Sched": null, "RMU1_FR_Sched": null, "RMU2_FR_Sched": null, "RMU3_FR_Sched": null, "RMU1_DR_Sched": null, "RMU2_DR_Sched": null, "RMU3_DR_Sched": null, "RMU1_Actual_Sched": null, "RMU2_Actual_Sched": null, "RMU3_Actual_Sched": null },
    {"TimestampLabel": "00:00", "U1ENPrice": null, "RURMPrice": null, "U2ENPrice": null, "RDRMPrice": null, "U3ENPrice": null, "CRRMPrice": null, "RMU1_EN_Sched": null, "RMU2_EN_Sched": null, "RMU3_EN_Sched": null, "RMU1_RU_Sched": null, "RMU2_RU_Sched": null, "RMU3_RU_Sched": null, "RMU1_RD_Sched": null, "RMU2_RD_Sched": null, "RMU3_RD_Sched": null, "RMU1_FR_Sched": null, "RMU2_FR_Sched": null, "RMU3_FR_Sched": null, "RMU1_DR_Sched": null, "RMU2_DR_Sched": null, "RMU3_DR_Sched": null, "RMU1_Actual_Sched": null, "RMU2_Actual_Sched": null, "RMU3_Actual_Sched": null },
    {"TimestampLabel": "00:00", "U1ENPrice": null, "RURMPrice": null, "U2ENPrice": null, "RDRMPrice": null, "U3ENPrice": null, "CRRMPrice": null, "RMU1_EN_Sched": null, "RMU2_EN_Sched": null, "RMU3_EN_Sched": null, "RMU1_RU_Sched": null, "RMU2_RU_Sched": null, "RMU3_RU_Sched": null, "RMU1_RD_Sched": null, "RMU2_RD_Sched": null, "RMU3_RD_Sched": null, "RMU1_FR_Sched": null, "RMU2_FR_Sched": null, "RMU3_FR_Sched": null, "RMU1_DR_Sched": null, "RMU2_DR_Sched": null, "RMU3_DR_Sched": null, "RMU1_Actual_Sched": null, "RMU2_Actual_Sched": null, "RMU3_Actual_Sched": null },
    {"TimestampLabel": "00:00", "U1ENPrice": null, "RURMPrice": null, "U2ENPrice": null, "RDRMPrice": null, "U3ENPrice": null, "CRRMPrice": null, "RMU1_EN_Sched": null, "RMU2_EN_Sched": null, "RMU3_EN_Sched": null, "RMU1_RU_Sched": null, "RMU2_RU_Sched": null, "RMU3_RU_Sched": null, "RMU1_RD_Sched": null, "RMU2_RD_Sched": null, "RMU3_RD_Sched": null, "RMU1_FR_Sched": null, "RMU2_FR_Sched": null, "RMU3_FR_Sched": null, "RMU1_DR_Sched": null, "RMU2_DR_Sched": null, "RMU3_DR_Sched": null, "RMU1_Actual_Sched": null, "RMU2_Actual_Sched": null, "RMU3_Actual_Sched": null }
  ];
  currentInterval
  USDollar = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
  });
  
  RMRegion = [
    {
      UnitNumber: 'RESERVE PRICES - LUZON',
      UnitID: 'CLUZ',
      bColor:'',
      fColor:''
    },
    {
      UnitNumber: 'RESERVE PRICES - VISAYAS',
      UnitID: 'CVIS',
      bColor:'',
      fColor:''
    },
    {
      UnitNumber: 'RESERVE PRICES - MINDANAO',
      UnitID: 'CMIN',
      bColor:'',
      fColor:''
    },
  ];
  currentRegion = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  };
  RMEnPrice;
  RMEnPriceUnit = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  }
  RMunit1;
  RMcurrentUnit1 = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  }
  RMU1IsLimit = true
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

  ngOnInit() {
    let sessStore = JSON.parse(sessionStorage.getItem("reserveMarket"))
    if (sessStore !== null) {
      if (sessStore['region']) {
        this.currentRegion.id = sessStore['region'].UnitID;
        this.currentRegion.name = sessStore['region'].UnitNumber;
      }

      if (sessStore['enPrice']) {
        this.RMEnPriceUnit.id = sessStore['enPrice'].UnitID;
        this.RMEnPriceUnit.name = sessStore['enPrice'].UnitNumber;
      }
      
      if (sessStore['U1']) {
        this.RMcurrentUnit1.id = sessStore['U1'].UnitID;
        this.RMcurrentUnit1.name = sessStore['U1'].UnitNumber;
      }

      if (sessStore['U2']) {
        this.RMcurrentUnit2.id = sessStore['U2'].UnitID;
        this.RMcurrentUnit2.name = sessStore['U2'].UnitNumber;
      }

      if (sessStore['U3']) {
        this.RMcurrentUnit3.id = sessStore['U3'].UnitID;
        this.RMcurrentUnit3.name = sessStore['U3'].UnitNumber;
      }
      this.RefreshData()
    } else {
      sessionStorage.setItem("reserveMarket", JSON.stringify({}))
    }
  
    this.isShowBid = localStorage.getItem('IsShowBid');
    this.now = moment("","MM/DD/YYYY HH:mm:ss");
    this.isWithAlarmDisable = localStorage.getItem('IsAlarmDisable');
    //refresh button click event from Trader Page to Reserve Market
    this.eventService.getClickEvent()
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.ManualRefresh();
    }); 

    this.dashboardType = "reserveMarket";
    this.SetTimeFromServer();
    this.timerDT = setInterval(() => {
      this.SetTimeFromServer();
    }, 15000); 
  }
  userLogs(action:string) {
    const data = {
      UserID: localStorage.getItem('UserID'),
      Action: action,
      ModuleID: 1
    };
    this.userService.userLogs(data).subscribe();
  }
  // NoInternetAudio(){
  //   let audio = new Audio();
  //   audio.src = "assets/audio/no_connection.mp3";
  //   audio.load();
  //   audio.play();
  // }

ngAfterViewInit(){
    this.alarmTriggered=false;
    this.PopulateUnits();
    this.SetIntervals();
    this.checkAndClearPreviewOnReload(); 
    this.clearAllPreviewValuesAtIntervals();
    this.TimerGetData();
    this.tempValue = this.eventService.getItem('tempValue');
    if(this.tempValue==null||this.tempValue==false){
      this.tempValue=false;
    }
    // if(this.isAlarmDisable==false){
    //   this.alarmOutsideLimit=false;
    // }else if(this.isAlarmDisable==true){
    //   this.alarmOutsideLimit=false
    // }
    this.eventService.getenablingAlarmClickEvent()
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
     this.EnableAlarm();
    });

  this.eventService.getdisablingAlarmClickEvent()
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.DisableAlarm();
    });  
  }

 DisableAlarm(){
    console.log("RM disabling alarm");
    this.alarmOutsideLimit=false;
    this.alarmNoconnection=false;
    this.alarmRTDChanged=false;
    this.alertMessage=null;
    clearInterval(this.timerData);
    clearInterval(this.timerAlarmHAP);
    clearInterval(this.timerAlarmOutsideLimit);
    clearTimeout(this.timeoutId);
    this.tempValue=true;
  }

  EnableAlarm(){
    console.log("RM enabling alarm");
    this.tempValue=false;
  }
  
  getCurrentInterval(interval:string){
    this.currentInterval = interval;
    return interval;
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
  SetTimeFromServer(){
    this.RMDashboardService.getDT().subscribe(data=>{
      clearInterval(this.timerData);
      clearInterval(this.timerClock);
      this.TimerSetClock(data.toString());
      this.TimerGetData();
   });
  }

  KillAlarm(){
    this.alertMessage=null;
    this.alarmOutsideLimit=false;
    this.alarmNoconnection=false;
    this.alarmRTDChanged=false;
    clearInterval(this.timerAlarmOutsideLimit);
    clearTimeout(this.timeoutId);
  }

  PopulateUnits(){
    let permissionID = +localStorage.getItem('PermissionID');
    this.RMDashboardService.getUnitPerAccess(+permissionID).subscribe(data => {
      let bateries = Object.entries(data).map(entry => entry[1]).filter(e => (e.TypeID === "BATT" || e.UnitNumber === "13SMC_U01" || e.UnitNumber === "13SMC_U02") && e.UnitNumber !== "01ANGAT_A");
      // console.log(data);
      
      this.RMEnPrice = bateries
      this.RMunit1 = bateries;
      this.RMunit2 = bateries;
      this.RMunit3 = bateries;
    });
  }

  SetIntervals() {
    this.RMDashboardService.getInterval().subscribe(data => {
      let interval = data;
      for (let x= 0; x<= 14; x++) {
        this.dbValues[x].TimestampLabel = interval[x].TimestampLabel;
      }
      this.currentTimestamp = interval[4].Timestamp;
    }, error => {
      //error;
      //this.alertMessage = "No connection to server!";
      //if (!this.isAlarmDisable) {
        //this.timerAlarmNoConnection = setInterval(() => {
          //this.NoInternetAudio();
         //}, 4000);
      //}
    });
  }

  RefreshData(){
    this.PopulateUnits();
    this.SetIntervals();
    this.clearAllPreviewValuesAtIntervals
    this.initializePreviewFromLocalStorage
    this.clearPreviewValues
    if(this.currentRegion.name != '' && this.currentRegion.name != 'SELECT UNIT'){
      this.SetReserveMarketPricesValue(this.currentRegion.id, "price");
    }
    if(this.RMEnPriceUnit.name != '' && this.RMEnPriceUnit.name != 'SELECT UNIT'){
      this.SetReserveMarketValue(this.RMEnPriceUnit.name, "enPrice");
    }
    if(this.RMcurrentUnit1.name != '' && this.RMcurrentUnit1.name != 'SELECT UNIT'){
      this.SetReserveMarketValue(this.RMcurrentUnit1.name, "U1");
    }
    if(this.RMcurrentUnit2.name != '' && this.RMcurrentUnit2.name != 'SELECT UNIT'){
      this.SetReserveMarketValue(this.RMcurrentUnit2.name, "U2");
    }
    if(this.RMcurrentUnit3.name != '' && this.RMcurrentUnit2.name != 'SELECT UNIT'){
      this.SetReserveMarketValue(this.RMcurrentUnit3.name, "U3");
    }
  }

  ManualRefresh() {
    this.RefreshData();
    this.PopulateUnits();
  }

  SetReserveMarketPricesValue(unitNumber:string, unitType:string){
    // for( let x = 0; x <= 14; x++ ) {
    //   this.dbValues[x]["RURMPrice"] = ;
    //   this.dbValues[x]["RDRMPrice"] = ;
    //   this.dbValues[x]["CRRMPrice"] = ;
    // }
    this.RMDashboardService.getRMRegionPrices(unitNumber).subscribe(data => {
      let res = data;
      for( let x = 0; x <= 14; x++ ) {
        this.dbValues[x]["RURMPrice"] = res[0].ReserveSchedules[x].Schedule;
        this.dbValues[x]["RDRMPrice"] = res[1].ReserveSchedules[x].Schedule;
        this.dbValues[x]["CRRMPrice"] = res[2].ReserveSchedules[x].Schedule;
      }
    })
  }

  initializePreviewFromLocalStorage(unitNumber: string, unitType: string) {
    const now = new Date();
  
    const previewFields = [
      { key: `preview_${unitNumber}_U1ENPrice`, column: "U1ENPrice" },
      { key: `preview_${unitNumber}_${unitType}_EN_Sched`, column: `RM${unitType}_EN_Sched` },
      { key: `preview_${unitNumber}_${unitType}_RU_Sched`, column: `RM${unitType}_RU_Sched` },
      { key: `preview_${unitNumber}_${unitType}_RD_Sched`, column: `RM${unitType}_RD_Sched` },
      { key: `preview_${unitNumber}_${unitType}_FR_Sched`, column: `RM${unitType}_FR_Sched` },
      { key: `preview_${unitNumber}_${unitType}_DR_Sched`, column: `RM${unitType}_DR_Sched` },
    ];
  
    for (const { key, column } of previewFields) {
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          let value: number | null = null;
  
          if (key.includes("U1ENPrice")) {
            const parsed = JSON.parse(stored);
            const timestamp = new Date(parsed.timestamp);
            const diffMinutes = (now.getTime() - timestamp.getTime()) / 60000;
            if (diffMinutes <= 5) {
              value = parsed.value;
            }
          } else {
            value = +stored;
          }
          if (value != null) {
            this.dbValues[3][column] = value; // Index 3 is the 4th column
          }
        } catch {
          localStorage.removeItem(key);
        }
      }
    }
  }
  
  clearAllPreviewValuesAtIntervals() {
  setInterval(() => {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    if (minutes % 5 === 0 && seconds === 5 && this.lastClearedMinute !== minutes) {
      this.lastClearedMinute = minutes;
      this.clearPreviewValues();
      this.previewCleared = true;
      localStorage.setItem('lastPreviewClearedAt', now.toISOString());
    }
  }, 1000);
}
checkAndClearPreviewOnReload() {
  const lastClearedISO = localStorage.getItem('lastPreviewClearedAt');
  const now = new Date();
  const nowMinutes = now.getMinutes();

  if (!lastClearedISO) {
    // No previous clear, so do it now
    this.clearPreviewValues();
    localStorage.setItem('lastPreviewClearedAt', now.toISOString());
    console.log("Preview cleared on first-time load.");
    return;
  }

  const lastCleared = new Date(lastClearedISO);
  const diffMs = now.getTime() - lastCleared.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes >= 5 || (nowMinutes % 5 === 0 && now.getSeconds() < 10)) {
    // Either it's been > 5 mins, or we're at a new 5-min boundary
    this.clearPreviewValues();
    localStorage.setItem('lastPreviewClearedAt', now.toISOString());
    console.log("Preview cleared on reload based on timestamp check.");
  } else {
    console.log("Preview NOT cleared on reload - recent clear at", lastCleared.toLocaleTimeString());
  }
}
clearPreviewValues() {
  const unitNumber = this.selectedUnitNumber;
  const previewKeys = [
    `preview_${unitNumber}_U1ENPrice`,
    `preview_${unitNumber}_U1RUPrice`,
    `preview_${unitNumber}_U1RDPrice`,
    `preview_${unitNumber}_U1FRPrice`,
    `preview_${unitNumber}_U1CRPrice`,
    `preview_${unitNumber}_EN_Sched`,
    `preview_${unitNumber}_RU_Sched`,
    `preview_${unitNumber}_RD_Sched`,
    `preview_${unitNumber}_FR_Sched`,
    `preview_${unitNumber}_CR_Sched`,
    `preview_${unitNumber}_DR_Sched`,
  ];

  for (const key of previewKeys) {
    localStorage.removeItem(key);
  }

  if (this.dbValues[3]) {
    const previewFields = [
      "U1ENPrice", "U1RUPrice", "U1RDPrice", "U1FRPrice", "U1CRPrice",
      "EN_Sched", "RU_Sched", "RD_Sched", "FR_Sched", "DR_Sched"
    ];
    previewFields.forEach(field => this.dbValues[3][field] = null);
  }

  console.log("Preview values cleared.");
}

  SetReserveMarketValue(unitNumber: string, unitType: string) {
    this.initializePreviewFromLocalStorage(unitNumber, unitType);
    this.RMDashboardService.getReserveSchedules(unitNumber).subscribe(data => {
      let res = data as any[];
      const now = new Date();
      for (let x = 0; x <= 14; x++) {
        const isPreviewSlot = x === 3;  
        // === Handle EN Price Preview ===
        if (unitType === "enPrice") {
          const previewKey = `preview_${unitNumber}_U1ENPrice`;
          const clearKey = `${previewKey}_cleared`;
          let enPrice = null;
      
          if (res.length > 5 && res[5].ReserveSchedules && res[5].ReserveSchedules[x]) {
            enPrice = res[5].ReserveSchedules[x].Schedule;
          }
      
          if (isPreviewSlot) {
            const stored = localStorage.getItem(previewKey);
            const now = new Date();
            const seconds = now.getSeconds();
            const minutes = now.getMinutes();
      
            // === Clear at hh:mm:05 (i.e., every 5 mins + 5 sec) ===
            const shouldClear = (minutes % 5 === 0 && seconds >= 5 && seconds < 7);
            // === Load value again after 1 minute and 5 sec ===
            const allowRestore = (minutes % 5 === 1 && seconds >= 7);
      
            if (shouldClear) {
              // Clear value and mark as cleared
              localStorage.removeItem(previewKey);
              localStorage.setItem(clearKey, now.toISOString());
              this.dbValues[x]["U1ENPrice"] = null;
            } else if (enPrice !== null) {
              // Save fresh backend value and reset clear flag
              this.dbValues[x]["U1ENPrice"] = enPrice;
              localStorage.setItem(previewKey, JSON.stringify({
                value: enPrice,
                timestamp: now.toISOString()
              }));
              localStorage.removeItem(clearKey);
            } else if (stored && allowRestore) {
              const cleared = localStorage.getItem(clearKey);
              if (!cleared) {
                try {
                  const parsed = JSON.parse(stored);
                  this.dbValues[x]["U1ENPrice"] = parsed.value;
                } catch {
                  localStorage.removeItem(previewKey);
                  this.dbValues[x]["U1ENPrice"] = null;
                }
              } else {
                this.dbValues[x]["U1ENPrice"] = null;
              }
            } else {
              this.dbValues[x]["U1ENPrice"] = null;
            }
      
          } else {
            // Regular (non-preview) values
            this.dbValues[x]["U1ENPrice"] = enPrice;
          }
        }
      
        // === Other Reserve Schedules ===
        const schedFields = [
          { field: "EN_Sched", index: 0 },
          { field: "RU_Sched", index: 3 },
          { field: "RD_Sched", index: 2 },
          { field: "FR_Sched", index: 1 },
          { field: "DR_Sched", index: 4 }
        ];
      
        for (const { field, index } of schedFields) {
          const key = `RM${unitType}_${field}`;
          const previewStorageKey = `preview_${unitNumber}_${unitType}_${field}`;
          let newValue = null;
      
          if (res.length > index && res[index].ReserveSchedules && res[index].ReserveSchedules[x]) {
            newValue = res[index].ReserveSchedules[x].Schedule;
          }
      
          if (isPreviewSlot) {
            if (newValue !== null && newValue !== undefined && newValue !== '') {
                this.dbValues[x][key] = newValue;
                localStorage.setItem(previewStorageKey, newValue.toString());
            } else {
                this.dbValues[x][key] = null;
            }
        } else {
            this.dbValues[x][key] = (newValue !== '' ? newValue : null);
        }
        }
      
        // === Status ===
        this.dbValues[x][`RM${unitType}_EN_Status`] = res.length > 0 && res[0].ReserveSchedules && res[0].ReserveSchedules.length > x ? res[0].ReserveSchedules[x].DataStatus : null;
        this.dbValues[x][`RM${unitType}_RU_Status`] = res.length > 3 && res[3].ReserveSchedules && res[3].ReserveSchedules.length > x ? res[3].ReserveSchedules[x].DataStatus : null;
        this.dbValues[x][`RM${unitType}_RD_Status`] = res.length > 2 && res[2].ReserveSchedules && res[2].ReserveSchedules.length > x ? res[2].ReserveSchedules[x].DataStatus : null;
        this.dbValues[x][`RM${unitType}_FR_Status`] = res.length > 1 && res[1].ReserveSchedules && res[1].ReserveSchedules.length > x ? res[1].ReserveSchedules[x].DataStatus : null;
      
        // === Actual ===
        this.dbValues[x][`RM${unitType}_Actual_Sched`] = res.length > 0 && res[0].ReserveSchedules && res[0].ReserveSchedules.length > x
          ? res[0].ReserveSchedules[x].Actual : null;
      
        // === Show DR Column ===
        if (res.length > 4 && res[4].ReserveSchedules && res[4].ReserveSchedules.length > x &&
          res[4].ReserveSchedules[x].Schedule !== null && res[4].ReserveSchedules[x].Schedule !== undefined) {
          this["show" + unitType + "DRcolumn"] = true;
        }
      }
      
  
      // === Alarm for negative actual value ===
      const actualValue = this.dbValues[5][`RM${unitType}_Actual_Sched`];
      if (actualValue !== null && actualValue < 0) {
        this.alarmOutsideLimit = true;
      }
  
      // === Blinking Logic ===
      const getRounded = (val: any) => val != null ? Math.round(val) : null;
      this.RUtempStorage1 = getRounded(this.dbValues[4][`RM${unitType}_RU_Sched`]);
      this.RUtempStorage2 = getRounded(this.dbValues[5][`RM${unitType}_RU_Sched`]);
      this.RDtempStorage1 = getRounded(this.dbValues[4][`RM${unitType}_RD_Sched`]);
      this.RDtempStorage2 = getRounded(this.dbValues[5][`RM${unitType}_RD_Sched`]);
      this.FRtempStorage1 = getRounded(this.dbValues[4][`RM${unitType}_FR_Sched`]);
      this.FRtempStorage2 = getRounded(this.dbValues[5][`RM${unitType}_FR_Sched`]);
  
      if (
        (this.RUtempStorage1 !== null && this.RUtempStorage2 !== null && this.RUtempStorage1 !== this.RUtempStorage2) ||
        (this.RDtempStorage1 !== null && this.RDtempStorage2 !== null && this.RDtempStorage1 !== this.RDtempStorage2) ||
        (this.FRtempStorage1 !== null && this.FRtempStorage2 !== null && this.FRtempStorage1 !== this.FRtempStorage2)
      ) {
        this.alarmRTDChanged = true;
      }
    });
  }
  
  
  
  selectedPrice(id:number, units, currentUnit, unitType:string) {
    const selected = units.find(unit => unit.UnitID === id);

    // everytime a user selects a region save it to his sessionstorage
    let inSessionStore = JSON.parse(sessionStorage.getItem("reserveMarket"))
    inSessionStore[unitType] = selected;
    sessionStorage.setItem("reserveMarket", JSON.stringify(inSessionStore))

    currentUnit.id = selected.UnitID;
    currentUnit.name = selected.UnitNumber;

    if (currentUnit.name=='SELECT UNIT') {
      // if user selected "SELECT UNIT" in dropdown; clear all data
      for (let x= 0; x<= 14; x++) {
        this.dbValues[x]["RURMPrice"] = null;
        this.dbValues[x]["RDRMPrice"] = null;
        this.dbValues[x]["CRRMPrice"] = null;
      }

      // this.PlotHAPChart();
      // this.PlotDAPChart();

    } else {
      // if(inSessionStore[])
      this.SetReserveMarketPricesValue(currentUnit.id, unitType);
      // this.PlotHAPChart();
      // this.PlotDAPChart();

      //console.log('unit selected');
      this.userLogs('RTD_Unit: ' + currentUnit.name);
    }
  }

  selectedUnit(id:number, units, currentUnit, unitType:string) {
    const selected = units.find(unit => unit.UnitID === id);

    // everytime a user selects a region save it to his sessionstorage
    let inSessionStore = JSON.parse(sessionStorage.getItem("reserveMarket"))
    inSessionStore[unitType] = selected;
    sessionStorage.setItem("reserveMarket", JSON.stringify(inSessionStore))
    
    currentUnit.id = selected.UnitID;
    currentUnit.name = selected.UnitNumber; 

    if (currentUnit.name=='SELECT UNIT') {
      // if user selected "SELECT UNIT" in dropdown; clear all data
      for (let x= 0; x<= 14; x++) {
        this.dbValues[x][unitType + "ENPrice"] = null;
        this.dbValues[x][unitType + "RMPrice"] = null;
        this.dbValues[x]["RM" + unitType + "_EN_Sched"] = null;
        this.dbValues[x]["RM" + unitType + "_RU_Sched"] = null;
        this.dbValues[x]["RM" + unitType + "_RD_Sched"] = null;
        this.dbValues[x]["RM" + unitType + "_FR_Sched"] = null;
        this.dbValues[x]["RM" + unitType + "_DR_Sched"] = null;
      }
    } else {
      this.SetReserveMarketValue(currentUnit.name, unitType);
      this.userLogs('RTD_Unit: ' + currentUnit.name);
    }
  }

  OpenOverridModal(content: NgbModal, unitNumber:string){
    this.selectedUnitNumber = unitNumber;
    this.RMDashboardService.getOverrideValue(unitNumber).subscribe(data => {
      let overrideValue = data;
      console.log(overrideValue);
      
      // this.isOverride = overrideValue['IsUse'];
      // this.overrideValues.en = overrideValue['Value'];
      this.isOverride.en = overrideValue['IsUse']
      this.isOverride.ru = overrideValue['RuIsUse']
      this.isOverride.rd = overrideValue['RdIsUse']
      this.isOverride.cr = overrideValue['FrIsUse']
      this.isOverride.dr = overrideValue['DrIsUse']
      this.overrideValues.en = overrideValue['Value']
      this.overrideValues.ru = overrideValue['RuValue']
      this.overrideValues.rd = overrideValue['RdValue']
      this.overrideValues.cr = overrideValue['FrValue']
      this.overrideValues.dr = overrideValue['DrValue']
    });
    
    this.modalReference = this.modalService.open(content, { size: 'sm', centered: true });
  }
  TimerGetData(){        
    this.timerData = setInterval(() => {  
        if (+moment(this.now).second() === 3) {
          this.RefreshData();
        }
        this.isAlarmDisable=this.tempValue;
        //console.log(this.isAlarmDisable);
        if(!this.isAlarmDisable && this.dashboardType == 'reserveMarket'){
          if(+moment(this.now).second() == 10){
            if(this.alarmOutsideLimit){
              //console.log(this.alarmOutsideLimit)
              this.alertMessage = "Actual MW, Outside limits!";
              this.OutsideLimitAudio();
              this.timerAlarmOutsideLimit = setInterval(() => {
              this.OutsideLimitAudio();
            }, 4000);
              this.timeoutId = setTimeout(() => {
              clearInterval(this.timerAlarmOutsideLimit);
              this.alertMessage=null;
              this.alarmOutsideLimit=false;
              }, 30000);
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
            // if(alarmMinutes.includes(currentMinute)) {
            if(currentMinute % 5 == 0){
              //console.log("Minute is in the alarm list");
              if (currentSecond >= 4 && currentSecond <= 15) {
                    //console.log("Second is from 5s to 15s");
                    if (this.alarmRTDChanged && !this.alarmTriggered) {
                      //console.log("alarmRTDChanged is true");
                      this.alertMessage = "RTD has changed!";
                      this.RTDChangedAudio();
                      this.alarmRTDChanged=false;
                      this.alarmTriggered = true;
                    }
                }
            }else {
              this.alarmRTDChanged = false;
              this.alarmTriggered = false;
            }
        }       
          // if(+moment(this.now).minute() == 21 && +moment(this.now).second() == 2){
          //     this.PlotDAPChart();
          //     this.PlotAllUnitDAPChart();
          // }
    }, 1000);
  }

  HAPAudio(){
    let audio = new Audio();
    audio.src = "assets/audio/hap.mp3";
    audio.load();
    audio.play();
  }

  OverrideAudio(){
    this.eventService.playAudio("assets/audio/override.mp3");
  }

 
  NoInternetAudio(){
    let audio = new Audio();
    audio.src = "assets/audio/no_connection.mp3";
    audio.load();
    audio.play();
  }
 


  OverrideValueRM(){
    if(this.isOverride && this.overrideValues.cr == null && this.overrideValues.ru == null && this.overrideValues.rd == null && this.overrideValues.en == null){
      return
    }
    
    const payload = {
      UnitNumber: this.selectedUnitNumber,
      IsReserve: true,
      Value: this.overrideValues.en,
      IsUse: this.isOverride.en,
      FrValue: this.overrideValues.cr,
      RuValue: this.overrideValues.ru,
      RdValue: this.overrideValues.rd,
      DrValue: this.overrideValues.dr,
      FrIsUse: this.isOverride.cr,
      RuIsUse: this.isOverride.ru,
      RdIsUse: this.isOverride.rd,
      DrIsUse: this.isOverride.dr,
    };
    console.log(payload);
    
    this.successMessage = JSON.stringify(payload)
    this.modalReference.close();
    this.timerMessage = setInterval(() => {
      clearInterval(this.timerMessage);
    }, 3000);

    this.RMDashboardService.saveOverrideValue(payload).subscribe(data => {
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
  }

  

  RTDChangedAudio(){
    let audio = new Audio();
    audio.src = "assets/audio/rtd_changed.mp3";
    audio.load();
    audio.play();
  }
  OutsideLimitAudio(){

    this.eventService.playAudio("assets/audio/outside_limit.mp3")
    
    //let audio = new Audio();
    //audio.src = "assets/audio/outside_limit.mp3";
    //audio.load();
    //audio.play();
  }

  ngOnDestroy(){
    clearInterval(this.timerData);
    clearInterval(this.timerDT);
    clearTimeout(this.timerAlarmOutsideLimit);
    clearInterval(this.timerAlarmHAP);
    clearInterval(this.timerAlarmNoConnection);
    this.alarmOutsideLimit=false;
    this.alarmNoconnection=false;
    this.alarmRTDChanged=false;
    this.alertMessage =null;
    if (this.timerAlarmOutsideLimit) {
      clearInterval(this.timerAlarmOutsideLimit);
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}
