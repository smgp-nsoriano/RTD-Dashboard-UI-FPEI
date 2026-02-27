import { ChangeDetectorRef,Component, OnInit,AfterViewInit ,OnDestroy} from '@angular/core';
import { Router,NavigationEnd } from '@angular/router';
import {takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { Subscription,Subject } from 'rxjs';
import { faRetweet,faBellSlash,faEdit } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SystemDemandDashboardServiceService } from './system-demand-dashboard.service';
import { EventService } from '../trader-dashboard/EventService';
import { UsersService } from '../users/users.service';
import { UnitSelectionService } from '../unit-selection.service';

@Component({
  selector: 'app-system-demand-dashboard',
  templateUrl: './system-demand-dashboard.component.html',
  styleUrls: ['./system-demand-dashboard.component.scss']
})
export class SystemDemandDashboardComponent implements OnInit,AfterViewInit,OnDestroy {
  private destroy$ = new Subject<void>();
  constructor(
    private router: Router,
    private unitPriceService: UnitSelectionService,
    private cdr: ChangeDetectorRef,
    private userService: UsersService,
    private eventService: EventService,
    private SMDashboardService: SystemDemandDashboardServiceService) { }
  
    routerSubscription: Subscription;
  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
  now:any;
  timerClock: any;
  timerDT: any;
  timerData: any;
  alertMessage:string;
  faRecycle= faRetweet;
  faBellSlash = faBellSlash;
  faEdit = faEdit;
  isAlarmDisable:boolean;
  alarmEnable:boolean;
  isWithAlarmDisable:string;
  isShowBid:string;
  isShowPrice:string;
  intervalId: any;
  unitPrice;
  updateFlag = true;
  units;
  intervals;
  modalReference: NgbModalRef;
  currentInterval: string;
  currentTimestamp: string;
  luzDemand:number;
  visDemand:number;
  minDemand:number;
  PhilDemand:number;
  ccurrentUnitPrice: any = { name: '' };
  unitType: string = 'Price';
  dbValues: any[] = [];
  currentUnitPrice = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  };

  successMessage:string;
  
  ngOnInit() {
    const unitType = this.unitType || "defaultType";
    this.initializeUnitFromSession(this.currentUnitPrice, unitType);
    this.unitPriceService.setCurrentUnitPrice(this.currentUnitPrice);

  this.isShowPrice = localStorage.getItem('IsShowPrice');
    this.bodyTag.classList.add('bg-dark');
    this.now = moment("","MM/DD/YYYY HH:mm:ss");
    this.isWithAlarmDisable = localStorage.getItem('IsAlarmDisable');
    this.TimerGetData();
    this.GetSystemDemand();
    this.PopulateUnits();
    this.SetIntervals();
    this.DefaultDashboardValue();
    this.SetTimeFromServer();
    this.timerDT = setInterval(() => {
      this.SetTimeFromServer();
    }, 15000);
  }

  ngAfterViewInit(){
    this.eventService.getClickEvent()
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.ManualRefresh();
    }); 

    // this.eventService.getenablingAlarmClickEvent()
    // .pipe(takeUntil(this.destroy$))
    // .subscribe(() => {
    //  this.EnableAlarm();
    // });

  // this.eventService.getdisablingAlarmClickEvent()
  //   .pipe(takeUntil(this.destroy$))
  //   .subscribe(() => {
  //     this.DisableAlarm();
  //   });  
  }

  TimerSetClock(dt:string){
    this.now = moment(dt,"MM/DD/YYYY HH:mm:ss");
    this.timerClock = setInterval(() => {
      this.now.add(1, 'second');
    }, 1000);
  }

  FormatClock(){
    return this.now.format('MMMM DD, YYYY HH:mm:ss');
  }

  TimerGetData() {
    this.timerData = setInterval(() => {
      this.now = moment();
      if (this.now.second() === 3) {
          this.RefreshData();
      }
    }, 1000);
  }
  RefreshData(){
    this.SetIntervals();
    this.PopulateUnits();
    if (this.currentUnitPrice.name !== '' && this.currentUnitPrice.name !== 'SELECT UNIT') {
      this.SetUnitPrice(this.currentUnitPrice.name);
    }
  }


  ManualRefresh(){
    console.log("System Demand Refresh Triggered")
    this.RefreshData();
    this.PopulateUnits();
  }

  SetTimeFromServer(){
      this.SMDashboardService.getDT().subscribe(data=>{
      this.TimerSetClock(data.toString());
    });
  }

  SetIntervals(){
    this.SMDashboardService.getInterval().subscribe(data => {
      let interval = data;
      for(let x= 0; x<= 14; x++){
        this.dbValues[x].TimestampLabel = interval[x].TimestampLabel;
       }
       this.currentTimestamp = interval[4].Timestamp;
    },error=>{
    //   error;
    //   this.alertMessage = "No connection to server!";
    //     if (!this.isAlarmDisable) {
    //       this.timerAlarmNoConnection = setInterval(() => {
    //         this.NoInternetAudio();
    //        }, 4000);
    //     }
    });
  }
  DefaultDashboardValue(){
    this.dbValues = [ 
        {"TimestampLabel": "00:00", "PriceSched": null, "PhilDemand":null, "luzDemand": null, "visDemand": null, "minDemand": null},
        {"TimestampLabel": "00:00", "PriceSched": null, "PhilDemand":null, "luzDemand": null, "visDemand": null, "minDemand": null},
        {"TimestampLabel": "00:00", "PriceSched": null, "PhilDemand":null, "luzDemand": null, "visDemand": null, "minDemand": null},
        {"TimestampLabel": "00:00", "PriceSched": null, "PhilDemand":null, "luzDemand": null, "visDemand": null, "minDemand": null},
        {"TimestampLabel": "00:00", "PriceSched": null, "PhilDemand":null, "luzDemand": null, "visDemand": null, "minDemand": null},
        {"TimestampLabel": "00:00", "PriceSched": null, "PhilDemand":null, "luzDemand": null, "visDemand": null, "minDemand": null},
        {"TimestampLabel": "00:00", "PriceSched": null, "PhilDemand":null, "luzDemand": null, "visDemand": null, "minDemand": null},
        {"TimestampLabel": "00:00", "PriceSched": null, "PhilDemand":null, "luzDemand": null, "visDemand": null, "minDemand": null},
        {"TimestampLabel": "00:00", "PriceSched": null, "PhilDemand":null, "luzDemand": null, "visDemand": null, "minDemand": null},
        {"TimestampLabel": "00:00", "PriceSched": null, "PhilDemand":null, "luzDemand": null, "visDemand": null, "minDemand": null},
        {"TimestampLabel": "00:00", "PriceSched": null, "PhilDemand":null, "luzDemand": null, "visDemand": null, "minDemand": null},
        {"TimestampLabel": "00:00", "PriceSched": null, "PhilDemand":null, "luzDemand": null, "visDemand": null, "minDemand": null},
        {"TimestampLabel": "00:00", "PriceSched": null, "PhilDemand":null, "luzDemand": null, "visDemand": null, "minDemand": null},
        {"TimestampLabel": "00:00", "PriceSched": null, "PhilDemand":null, "luzDemand": null, "visDemand": null, "minDemand": null},
        {"TimestampLabel": "00:00", "PriceSched": null, "PhilDemand":null, "luzDemand": null, "visDemand": null, "minDemand": null}
    ];
  }
  PopulateUnits(){
    let permissionID = +localStorage.getItem('PermissionID');
    this.SMDashboardService.getUnitPerAccess(+permissionID).subscribe(data => {
      this.unitPrice = data;
    });
  }
  getCurrentInterval(interval:string){
    this.currentInterval = interval;
    return interval;
  }

  GetSystemDemand(): void {
  this.SMDashboardService.getSysDemand().subscribe(data => {
    let price = data;
    for (let x = 0; x <= 14; x++) {
      this.setUnitValue(price, x);
    }
    this.RefreshData();
  });
}
  setUnitValue(price: any, index: number): void {
    this.dbValues[index] = {
      luzDemand: price[0][index].Value,
      visDemand: price[1][index].Value,
      minDemand: price[2][index].Value,
      PhilDemand: price[0][index].Value + price[1][index].Value + price[2][index].Value
    };
  }
  SetUnitPrice(unitNumber: string) {
    if (!unitNumber || unitNumber === 'SELECT UNIT') {
      return;
    }

    if (unitNumber === '01SUAL_G01') {
      // Perform logic to set the corresponding values for '01SUAL_G01'
      this.SMDashboardService.getSystemPrice(unitNumber).subscribe(data => {
        let price = data;
        for (let x = 0; x <= 14; x++) {
          this.dbValues[x].PriceSched = price[3][x].Value;
          this.dbValues[x].luzDemand = price[0][x].Value;
          this.dbValues[x].visDemand = price[1][x].Value;
          this.dbValues[x].minDemand = price[2][x].Value;
          this.dbValues[x].PhilDemand = price[0][x].Value + price[1][x].Value + price[2][x].Value;
        }
      });
    }else {
      this.SMDashboardService.getSystemPrice(unitNumber).subscribe(data => {
        let price = data;
        for (let x = 0; x <= 14; x++) {
          this.dbValues[x].PriceSched = price[3][x].Value;
          this.dbValues[x].luzDemand = price[0][x].Value;
          this.dbValues[x].visDemand = price[1][x].Value;
          this.dbValues[x].minDemand = price[2][x].Value;
          this.dbValues[x].PhilDemand = price[0][x].Value + price[1][x].Value + price[2][x].Value
        }
      });
    }
  }

  

  selectedUnit(id: number, units, currentUnit, unitType: string) {
   
    const selected = units.find(unit => unit.UnitID === id);
    this.unitType = unitType;
    let inSessionStore = JSON.parse(sessionStorage.getItem("systemDemand")) || {};
    inSessionStore[this.unitType] = selected;
    sessionStorage.setItem("systemDemand", JSON.stringify(inSessionStore));
    currentUnit.id = selected.UnitID;
    currentUnit.name = selected.UnitNumber;
    if (currentUnit.name === 'SELECT UNIT') {
        for (let x = 0; x <= 14; x++) {
            this.dbValues[x].PriceSched = null;
        }
    } else {
        this.SetUnitPrice(currentUnit.name);
    }
    this.unitPriceService.setCurrentUnitPrice(this.currentUnitPrice);
}

initializeUnitFromSession(currentUnit, unitType) {
  let inSessionStore = JSON.parse(sessionStorage.getItem("systemDemand")) || {};
  const savedUnit = inSessionStore[unitType];

  if (savedUnit) {
      currentUnit.id = savedUnit.UnitID;
      currentUnit.name = savedUnit.UnitNumber;
      if (currentUnit.name !== 'SELECT UNIT') {
          this.SetUnitPrice(currentUnit.name);
      }
      else{
        currentUnit.name = "01SUAL_G01";
        this.SetUnitPrice(currentUnit.name);
      }
  } else {
      currentUnit.name = "01SUAL_G01";
      this.SetUnitPrice(currentUnit.name);
  }
  this.unitPriceService.setCurrentUnitPrice(this.currentUnitPrice);
}


  userLogs(action:string){
    const data = {
      UserID: localStorage.getItem('UserID'),
      Action: action,
      ModuleID: 1
    };
    this.userService.userLogs(data).subscribe();
  }
  ngOnDestroy() {  
    this.alertMessage =null;
    this.destroy$.next();
    this.destroy$.complete();
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
