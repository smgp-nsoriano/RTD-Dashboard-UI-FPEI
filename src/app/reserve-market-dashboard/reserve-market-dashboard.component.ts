import { Component, OnInit,OnDestroy, AfterViewInit} from '@angular/core';
import * as moment from 'moment';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../users/users.service';
import { ReserveMarketDashboardServiceService } from './reserve-market-dashboard-service.service';
import { EventService } from '../trader-dashboard/EventService';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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

  SetReserveMarketValue(unitNumber:string, unitType:string){
    this.RMDashboardService.getReserveSchedules(unitNumber).subscribe(data => {
      // let res = 
      //   [{"Type":"EN","ReserveSchedules":[{"Tagname":"HAPEG_EN_01LIMAY_BAT_MW.MV","Schedule":null,"Price":null,"Timestamp":"2024-02-07T21:20:00","Interval":"21:20"},{"Tagname":"HAPEG_EN_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:15:00","Interval":"21:15"},{"Tagname":"HAPEG_EN_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:10:00","Interval":"21:10"},{"Tagname":"HAPEG_EN_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:05:00","Interval":"21:05"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:00:00","Interval":"21:00"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:55:00","Interval":"20:55"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:50:00","Interval":"20:50"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:45:00","Interval":"20:45"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:40:00","Interval":"20:40"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:35:00","Interval":"20:35"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:30:00","Interval":"20:30"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:25:00","Interval":"20:25"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:20:00","Interval":"20:20"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:15:00","Interval":"20:15"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:10:00","Interval":"20:10"}]},
      //   {"Type":"FR","ReserveSchedules":[{"Tagname":"HAPEG_FR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:20:00","Interval":"21:20"},{"Tagname":"HAPEG_FR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:15:00","Interval":"21:15"},{"Tagname":"HAPEG_FR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:10:00","Interval":"21:10"},{"Tagname":"HAPEG_FR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:05:00","Interval":"21:05"},{"Tagname":"RTDEG_FR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:00:00","Interval":"21:00"},{"Tagname":"RTDEG_FR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:55:00","Interval":"20:55"},{"Tagname":"RTDEG_FR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:50:00","Interval":"20:50"},{"Tagname":"RTDEG_FR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:45:00","Interval":"20:45"},{"Tagname":"RTDEG_FR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:40:00","Interval":"20:40"},{"Tagname":"RTDEG_FR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:35:00","Interval":"20:35"},{"Tagname":"RTDEG_FR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:30:00","Interval":"20:30"},{"Tagname":"RTDEG_FR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:25:00","Interval":"20:25"},{"Tagname":"RTDEG_FR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:20:00","Interval":"20:20"},{"Tagname":"RTDEG_FR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:15:00","Interval":"20:15"},{"Tagname":"RTDEG_FR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:10:00","Interval":"20:10"}]},
      //   {"Type":"RD","ReserveSchedules":[{"Tagname":"HAPEG_RD_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:20:00","Interval":"21:20"},{"Tagname":"HAPEG_RD_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:15:00","Interval":"21:15"},{"Tagname":"HAPEG_RD_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:10:00","Interval":"21:10"},{"Tagname":"HAPEG_RD_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:05:00","Interval":"21:05"},{"Tagname":"RTDEG_RD_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:00:00","Interval":"21:00"},{"Tagname":"RTDEG_RD_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:55:00","Interval":"20:55"},{"Tagname":"RTDEG_RD_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:50:00","Interval":"20:50"},{"Tagname":"RTDEG_RD_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:45:00","Interval":"20:45"},{"Tagname":"RTDEG_RD_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:40:00","Interval":"20:40"},{"Tagname":"RTDEG_RD_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:35:00","Interval":"20:35"},{"Tagname":"RTDEG_RD_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:30:00","Interval":"20:30"},{"Tagname":"RTDEG_RD_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:25:00","Interval":"20:25"},{"Tagname":"RTDEG_RD_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:20:00","Interval":"20:20"},{"Tagname":"RTDEG_RD_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:15:00","Interval":"20:15"},{"Tagname":"RTDEG_RD_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:10:00","Interval":"20:10"}]},
      //   {"Type":"RU","ReserveSchedules":[{"Tagname":"HAPEG_RU_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:20:00","Interval":"21:20"},{"Tagname":"HAPEG_RU_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:15:00","Interval":"21:15"},{"Tagname":"HAPEG_RU_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:10:00","Interval":"21:10"},{"Tagname":"HAPEG_RU_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:05:00","Interval":"21:05"},{"Tagname":"RTDEG_RU_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:00:00","Interval":"21:00"},{"Tagname":"RTDEG_RU_01LIMAY_BAT_MW.MV","Schedule":123.0,"Price":null,"Timestamp":"2024-02-07T20:55:00","Interval":"20:55"},{"Tagname":"RTDEG_RU_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:50:00","Interval":"20:50"},{"Tagname":"RTDEG_RU_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:45:00","Interval":"20:45"},{"Tagname":"RTDEG_RU_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:40:00","Interval":"20:40"},{"Tagname":"RTDEG_RU_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:35:00","Interval":"20:35"},{"Tagname":"RTDEG_RU_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:30:00","Interval":"20:30"},{"Tagname":"RTDEG_RU_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:25:00","Interval":"20:25"},{"Tagname":"RTDEG_RU_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:20:00","Interval":"20:20"},{"Tagname":"RTDEG_RU_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:15:00","Interval":"20:15"},{"Tagname":"RTDEG_RU_01LIMAY_BAT_MW.MV","Schedule":40.0,"Price":null,"Timestamp":"2024-02-07T20:10:00","Interval":"20:10"}]},
      //   {"Type":"DR","ReserveSchedules":[{"Tagname":"HAPEG_DR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:20:00","Interval":"21:20"},{"Tagname":"HAPEG_DR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:15:00","Interval":"21:15"},{"Tagname":"HAPEG_DR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:10:00","Interval":"21:10"},{"Tagname":"HAPEG_DR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:05:00","Interval":"21:05"},{"Tagname":"RTDEG_DR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:00:00","Interval":"21:00"},{"Tagname":"RTDEG_DR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:55:00","Interval":"20:55"},{"Tagname":"RTDEG_DR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:50:00","Interval":"20:50"},{"Tagname":"RTDEG_DR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:45:00","Interval":"20:45"},{"Tagname":"RTDEG_DR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:40:00","Interval":"20:40"},{"Tagname":"RTDEG_DR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:35:00","Interval":"20:35"},{"Tagname":"RTDEG_DR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:30:00","Interval":"20:30"},{"Tagname":"RTDEG_DR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:25:00","Interval":"20:25"},{"Tagname":"RTDEG_DR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:20:00","Interval":"20:20"},{"Tagname":"RTDEG_DR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:15:00","Interval":"20:15"},{"Tagname":"RTDEG_DR_01LIMAY_BAT_MW.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:10:00","Interval":"20:10"}]},
      //   {"Type":"EN Price","ReserveSchedules":[{"Tagname":"HAPEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:20:00","Interval":"21:20"},{"Tagname":"HAPEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:15:00","Interval":"21:15"},{"Tagname":"HAPEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:10:00","Interval":"21:10"},{"Tagname":"HAPEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:05:00","Interval":"21:05"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:00:00","Interval":"21:00"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:55:00","Interval":"20:55"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:50:00","Interval":"20:50"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:45:00","Interval":"20:45"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:40:00","Interval":"20:40"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:35:00","Interval":"20:35"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:30:00","Interval":"20:30"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:25:00","Interval":"20:25"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:20:00","Interval":"20:20"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:15:00","Interval":"20:15"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T20:10:00","Interval":"20:10"}]},
      //   {"Type":"RM Price","ReserveSchedules":[{"Tagname":"HAPEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:20:00","Interval":"21:20"},{"Tagname":"HAPEG_EN_01LIMAY_BAT_P.MV","Schedule":123,"Price":null,"Timestamp":"2024-02-07T21:15:00","Interval":"21:15"},{"Tagname":"HAPEG_EN_01LIMAY_BAT_P.MV","Schedule":null,"Price":null,"Timestamp":"2024-02-07T21:10:00","Interval":"21:10"},{"Tagname":"HAPEG_EN_01LIMAY_BAT_P.MV","Schedule":null,"Price":null,"Timestamp":"2024-02-07T21:05:00","Interval":"21:05"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":null,"Price":null,"Timestamp":"2024-02-07T21:00:00","Interval":"21:00"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":null,"Price":null,"Timestamp":"2024-02-07T20:55:00","Interval":"20:55"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":null,"Price":null,"Timestamp":"2024-02-07T20:50:00","Interval":"20:50"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":null,"Price":null,"Timestamp":"2024-02-07T20:45:00","Interval":"20:45"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":null,"Price":null,"Timestamp":"2024-02-07T20:40:00","Interval":"20:40"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":null,"Price":null,"Timestamp":"2024-02-07T20:35:00","Interval":"20:35"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":null,"Price":null,"Timestamp":"2024-02-07T20:30:00","Interval":"20:30"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":null,"Price":null,"Timestamp":"2024-02-07T20:25:00","Interval":"20:25"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":null,"Price":null,"Timestamp":"2024-02-07T20:20:00","Interval":"20:20"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":null,"Price":null,"Timestamp":"2024-02-07T20:15:00","Interval":"20:15"},{"Tagname":"RTDEG_EN_01LIMAY_BAT_P.MV","Schedule":null,"Price":null,"Timestamp":"2024-02-07T20:10:00","Interval":"20:10"}]}]
      // ;
      let res = data;
      for( let x = 0; x <= 14; x++ ) {
        if(unitType === "enPrice"){
          this.dbValues[x]["U1ENPrice"] = res[5].ReserveSchedules[x].Schedule;
        }
        // this.dbValues[x][unitType + "RMPrice"] = null; // res[6].ReserveSchedules[x].Schedule
        this.dbValues[x]["RM" + unitType + "_EN_Sched"] = res[0].ReserveSchedules[x].Schedule;
        this.dbValues[x]["RM" + unitType + "_RU_Sched"] = res[3].ReserveSchedules[x].Schedule;
        this.dbValues[x]["RM" + unitType + "_RD_Sched"] = res[2].ReserveSchedules[x].Schedule;
        this.dbValues[x]["RM" + unitType + "_FR_Sched"] = res[1].ReserveSchedules[x].Schedule;
        this.dbValues[x]["RM" + unitType + "_DR_Sched"] = res[4].ReserveSchedules[x].Schedule;
        this.dbValues[x]["RM" + unitType + "_EN_Status"] = res[0].ReserveSchedules[x].DataStatus;
        this.dbValues[x]["RM" + unitType + "_RU_Status"] = res[3].ReserveSchedules[x].DataStatus;
        this.dbValues[x]["RM" + unitType + "_RD_Status"] = res[2].ReserveSchedules[x].DataStatus;
        this.dbValues[x]["RM" + unitType + "_FR_Status"] = res[1].ReserveSchedules[x].DataStatus;
        this.dbValues[x]["RM" + unitType + "_Actual_Sched"] = res[0].ReserveSchedules[x].Actual // null for now no actual yet;
        if (res[4].ReserveSchedules[x].Schedule !== null) {
          this["show"+ unitType +"DRcolumn"] = true // show dr column if there is value
        }
      }
      //console.log(this.dbValues[5]["RM" + unitType + "_Actual_Sched"])
      if(this.dbValues[5]["RM" + unitType + "_Actual_Sched"] < 0 && 
        this.dbValues[5]["RM" + unitType + "_Actual_Sched"] != null){
        this.alarmOutsideLimit=true;
      }
      this.RUtempStorage1 = this.dbValues[4]["RM" + unitType + "_RU_Sched"] != null ? Math.round(this.dbValues[4]["RM" + unitType + "_RU_Sched"]) : null;
      this.RUtempStorage2 = this.dbValues[5]["RM" + unitType + "_RU_Sched"] != null ? Math.round(this.dbValues[5]["RM" + unitType + "_RU_Sched"]) : null;
      this.RDtempStorage1 = this.dbValues[4]["RM" + unitType + "_RD_Sched"] != null ? Math.round(this.dbValues[4]["RM" + unitType + "_RD_Sched"]) : null;
      this.RDtempStorage2 = this.dbValues[5]["RM" + unitType + "_RD_Sched"] != null ? Math.round(this.dbValues[5]["RM" + unitType + "_RD_Sched"]) : null;
      this.FRtempStorage1 = this.dbValues[4]["RM" + unitType + "_FR_Sched"] != null ? Math.round(this.dbValues[4]["RM" + unitType + "_FR_Sched"]) : null;
      this.FRtempStorage2 = this.dbValues[5]["RM" + unitType + "_FR_Sched"] != null ? Math.round(this.dbValues[5]["RM" + unitType + "_FR_Sched"]) : null;

      if ((this.RUtempStorage1 != null && this.RUtempStorage2 != null && this.RUtempStorage1 !== this.RUtempStorage2) ||
        (this.RDtempStorage1 != null && this.RDtempStorage2 != null && this.RDtempStorage1 !== this.RDtempStorage2) ||
        (this.FRtempStorage1 != null && this.FRtempStorage2 != null && this.FRtempStorage1 !== this.FRtempStorage2)) {
        this.alarmRTDChanged = true;
      }
    })
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
            console.log("Current hours:", currentHours);
            console.log("Current minute:", currentMinute);
            console.log("Current second:", currentSecond);
            console.log(this.alarmRTDChanged);
            // if(alarmMinutes.includes(currentMinute)) {
            if(currentMinute % 5 == 0){
              console.log("Minute is in the alarm list");
              if (currentSecond >= 4 && currentSecond <= 15) {
                    console.log("Second is from 5s to 15s");
                    if (this.alarmRTDChanged && !this.alarmTriggered) {
                      console.log("alarmRTDChanged is true");
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
