import { Component, OnInit } from '@angular/core';
import { ReservePortfolioService } from './reserve-portfolio.service';
import { UsersService } from '../users/users.service';
import { UnitsService } from '../units/units.service';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-reserve-portfolio',
  templateUrl: './reserve-portfolio.component.html',
  styleUrls: ['./reserve-portfolio.component.scss']
})
export class ReservePortfolioComponent implements OnInit {
  faEdit = faEdit;
  tmp = ""
  interval: string = null

  now
  timerData
  timerDT
  timerClock

  modalReference
  selectedUnitNumber
  selectedPBRemarks
  isGenRemarks
  editremarksOf_index
  successMessage
  timerMessage

  reqtSched = [
    { header: "Regulation Up", cluz_reqt: null, cluz_sched: null, cvis_reqt: null, cvis_sched: null, cmin_reqt: null, cmin_sched: null },
    { header: "Regulation Down", cluz_reqt: null, cluz_sched: null, cvis_reqt: null, cvis_sched: null, cmin_reqt: null, cmin_sched: null },
    { header: "Contingency Reserve", cluz_reqt: null, cluz_sched: null, cvis_reqt: null, cvis_sched: null, cmin_reqt: null, cmin_sched: null }
  ]

  regions = ["LUZ", "VIS", "MIN"]
  unitRegionMapping = [
    {
      unitId: 1035,
      unitNumber: "01CNCEP_BAT",
      unitDisplayName: "CONCEPCION",
      region: 0,
      unitIsHideEdit: true,
      facility: null, rtd_en: null, rtd_ru: null, rtd_rd: null, rtd_cr: null, actual: null, mop: null, price_en: null, price_ru: null, price_rd: null, price_cr: null, remarks: null
    },
    {
      unitId: 1030,
      unitNumber: "01LAMAO_BAT",
      unitDisplayName: "LAMAO",
      region: 0,
      unitIsHideEdit: true,
      facility: null, rtd_en: null, rtd_ru: null, rtd_rd: null, rtd_cr: null, actual: null, mop: null, price_en: null, price_ru: null, price_rd: null, price_cr: null, remarks: null
    },
    {
      unitId: 1031,
      unitNumber: "01LIMAY_BAT",
      unitDisplayName: "LIMAY",
      region: 0,
      unitIsHideEdit: true,
      facility: null, rtd_en: null, rtd_ru: null, rtd_rd: null, rtd_cr: null, actual: null, mop: null, price_en: null, price_ru: null, price_rd: null, price_cr: null, remarks: null,
    },
    {
      unitId: 1032,
      unitNumber: "01MAGAPIT_BAT",
      unitDisplayName: "MAGAPIT",
      region: 0,
      unitIsHideEdit: true,
      facility: null, rtd_en: null, rtd_ru: null, rtd_rd: null, rtd_cr: null, actual: null, mop: null, price_en: null, price_ru: null, price_rd: null, price_cr: null, remarks: null
    },
    {
      unitId: 1014,
      unitNumber: "01MSINLO_BAT",
      unitDisplayName: "MASINLOC",
      region: 0,
      unitIsHideEdit: true,
      facility: null, rtd_en: null, rtd_ru: null, rtd_rd: null, rtd_cr: null, actual: null, mop: null, price_en: null, price_ru: null, price_rd: null, price_cr: null, remarks: null
    },
    {
      unitId: 1033,
      unitNumber: "01SNMAN_BAT",
      unitDisplayName: "SAN MANUEL",
      region: 0,
      unitIsHideEdit: true,
      facility: null, rtd_en: null, rtd_ru: null, rtd_rd: null, rtd_cr: null, actual: null, mop: null, price_en: null, price_ru: null, price_rd: null, price_cr: null, remarks: null
    },
    {
      unitId: 1039,
      unitNumber: "04ORMOC_BAT",
      unitDisplayName: "ORMOC",
      region: 1,
      unitIsHideEdit: true,
      facility: null, rtd_en: null, rtd_ru: null, rtd_rd: null, rtd_cr: null, actual: null, mop: null, price_en: null, price_ru: null, price_rd: null, price_cr: null, remarks: null
    },
    {
      unitId: 1036,
      unitNumber: "05TOLEDO_BAT",
      unitDisplayName: "TOLEDO",
      region: 1,
      unitIsHideEdit: true,
      facility: null, rtd_en: null, rtd_ru: null, rtd_rd: null, rtd_cr: null, actual: null, mop: null, price_en: null, price_ru: null, price_rd: null, price_cr: null, remarks: null
    },
    {
      unitId: 1028,
      unitNumber: "06KABAN_BAT",
      unitDisplayName: "KABANKALAN",
      region: 1,
      unitIsHideEdit: true,
      facility: null, rtd_en: null, rtd_ru: null, rtd_rd: null, rtd_cr: null, actual: null, mop: null, price_en: null, price_ru: null, price_rd: null, price_cr: null, remarks: null
    },
    {
      unitId: 1037,
      unitNumber: "07UBAY_BAT",
      unitDisplayName: "UBAY",
      region: 1,
      unitIsHideEdit: true,
      facility: null, rtd_en: null, rtd_ru: null, rtd_rd: null, rtd_cr: null, actual: null, mop: null, price_en: null, price_ru: null, price_rd: null, price_cr: null, remarks: null
    },
    {
      unitId: 1042,
      unitNumber: "11JASA_BAT",
      unitDisplayName: "JASAAN",
      region: 2,
      unitIsHideEdit: true,
      facility: null, rtd_en: null, rtd_ru: null, rtd_rd: null, rtd_cr: null, actual: null, mop: null, price_en: null, price_ru: null, price_rd: null, price_cr: null, remarks: null
    },
    {
      unitId: 1043,
      unitNumber: "11VILLA_BAT",
      unitDisplayName: "VILLANUEVA",
      region: 2,
      unitIsHideEdit: true,
      facility: null, rtd_en: null, rtd_ru: null, rtd_rd: null, rtd_cr: null, actual: null, mop: null, price_en: null, price_ru: null, price_rd: null, price_cr: null, remarks: null
    },
    {
      unitId: 1041,
      unitNumber: "13MACO_BAT",
      unitDisplayName: "MACO",
      region: 2,
      unitIsHideEdit: true,
      facility: null, rtd_en: null, rtd_ru: null, rtd_rd: null, rtd_cr: null, actual: null, mop: null, price_en: null, price_ru: null, price_rd: null, price_cr: null, remarks: null
    },
    {
      unitId: 1040,
      unitNumber: "13MALITA_BAT",
      unitDisplayName: "MALITA",
      region: 2,
      unitIsHideEdit: true,
      facility: null, rtd_en: null, rtd_ru: null, rtd_rd: null, rtd_cr: null, actual: null, mop: null, price_en: null, price_ru: null, price_rd: null, price_cr: null, remarks: null
    },
    {
      unitId: 9999,
      unitNumber: "01GAMU_BAT",
      unitDisplayName: "GAMU",
      region: 0,
      unitIsHideEdit: true,
      facility: null, rtd_en: null, rtd_ru: null, rtd_rd: null, rtd_cr: null, actual: null, mop: null, price_en: null, price_ru: null, price_rd: null, price_cr: null, remarks: null
    },
  ]
  sortedUnitRegionMapping = this.unitRegionMapping.sort((a, b) => a.region - b.region)

  constructor(private userService: UsersService, private ReservePortfolioService: ReservePortfolioService, private unitService: UnitsService, private modalService: NgbModal,) { }

  ngOnInit() {
    this.now = moment("","MM/DD/YYYY HH:mm:ss");
    this.SetTimeFromServer();
    this.timerDT = setInterval(() => {
      this.SetTimeFromServer();
    }, 15000);
    
    // this.GetInterval();
    this.RefreshDashboard();
  }

  SetTimeFromServer(){
    this.ReservePortfolioService.getDT().subscribe(data=>{
      clearInterval(this.timerData);
      clearInterval(this.timerClock);
      this.TimerSetClock(data.toString());
      this.TimerGetData();
    });
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

  TimerGetData(){
    this.timerData = setInterval(() => {
      if (+moment(this.now).second() == 3) {
        this.RefreshDashboard();
      }
    }, 1000);
  }

  PopulateUnits() {
    let permissionID = +localStorage.getItem('PermissionID');
    this.ReservePortfolioService.getUnitPerAccess(+permissionID).subscribe(data => {
      let bateries = Object.entries(data).map(entry => entry[1]).filter(e => e.TypeID === "BATT" && e.UnitNumber !== "01ANGAT_A");
      // console.log(bateries.map(el => [el.UnitNumber, el.UnitID]));
    });
  }

  RefreshDashboard() {
    console.log("Dashboard refresh");
    this.GetDataForReqtSchedTable();
    this.GetDataForMainTable();
  }

  GetInterval() {
    this.ReservePortfolioService.getUnitRegion().subscribe(data => {
      this.interval = data['Luz'][0].TimestampLabel
      this.RefreshDashboard();
    });
  }

  GetDataForMainTable() {
    this.ReservePortfolioService.getReserveSchedules().subscribe(data => {
      Object.entries(data).map(entry => entry[1]).forEach(element => {
        element.ReservePortfolios.forEach(unit => {
          let targetIndex = this.sortedUnitRegionMapping.findIndex(el => el.unitNumber === unit.UnitNumber);
          this.sortedUnitRegionMapping[targetIndex] = {
            ...this.sortedUnitRegionMapping[targetIndex],
            rtd_en: unit.RTD_EN,
            rtd_ru: unit.RTD_RU,
            rtd_rd: unit.RTD_RD,
            rtd_cr: unit.RTD_CR,
            actual: unit.Actual,
            mop: unit.MOP,
            price_en: unit.Price_EN,
            remarks: unit.Remarks,
          }
        })
      });
    }, err => {
      // do nothing
    });
  }

  getNumberOfUnitsInRegion(regionIndex: number){
    return this.sortedUnitRegionMapping.filter(el => el.region === regionIndex).length
  }

  GetDataForReqtSchedTable() {
    this.ReservePortfolioService.getRMRegionPrices24h("CLUZ").subscribe(data => {
      this.interval = data[0]["ReserveRegionalSchedules"][0].Interval;
      this.reqtSched[0].cluz_reqt = data[0]["ReserveRegionalSchedules"][0].MrktReqt;
      this.reqtSched[0].cluz_sched = data[0]["ReserveRegionalSchedules"][0].Schedule;

      this.reqtSched[1].cluz_reqt = data[1]["ReserveRegionalSchedules"][0].MrktReqt;
      this.reqtSched[1].cluz_sched = data[1]["ReserveRegionalSchedules"][0].Schedule;

      this.reqtSched[2].cluz_reqt = data[2]["ReserveRegionalSchedules"][0].MrktReqt;
      this.reqtSched[2].cluz_sched = data[2]["ReserveRegionalSchedules"][0].Schedule;

      let index_of_luz = this.sortedUnitRegionMapping.findIndex(unit => unit.region === 0); // the first instance of region
      this.sortedUnitRegionMapping[index_of_luz].price_ru = data[0]["ReserveRegionalSchedules"][0].Price;
      this.sortedUnitRegionMapping[index_of_luz].price_rd = data[1]["ReserveRegionalSchedules"][0].Price;
      this.sortedUnitRegionMapping[index_of_luz].price_cr = data[2]["ReserveRegionalSchedules"][0].Price;
    });
    this.ReservePortfolioService.getRMRegionPrices24h("CVIS").subscribe(data => {
      this.reqtSched[0].cvis_reqt = data[0]["ReserveRegionalSchedules"][0].MrktReqt;
      this.reqtSched[0].cvis_sched = data[0]["ReserveRegionalSchedules"][0].Schedule;

      this.reqtSched[1].cvis_reqt = data[1]["ReserveRegionalSchedules"][0].MrktReqt;
      this.reqtSched[1].cvis_sched = data[1]["ReserveRegionalSchedules"][0].Schedule;

      this.reqtSched[2].cvis_reqt = data[2]["ReserveRegionalSchedules"][0].MrktReqt;
      this.reqtSched[2].cvis_sched = data[2]["ReserveRegionalSchedules"][0].Schedule;

      let index_of_vis = this.sortedUnitRegionMapping.findIndex(unit => unit.region === 1); // the first instance of region
      this.sortedUnitRegionMapping[index_of_vis].price_ru = data[0]["ReserveRegionalSchedules"][0].Price;
      this.sortedUnitRegionMapping[index_of_vis].price_rd = data[1]["ReserveRegionalSchedules"][0].Price;
      this.sortedUnitRegionMapping[index_of_vis].price_cr = data[2]["ReserveRegionalSchedules"][0].Price;
    });
    this.ReservePortfolioService.getRMRegionPrices24h("CMIN").subscribe(data => {
      this.reqtSched[0].cmin_reqt = data[0]["ReserveRegionalSchedules"][0].MrktReqt;
      this.reqtSched[0].cmin_sched = data[0]["ReserveRegionalSchedules"][0].Schedule;

      this.reqtSched[1].cmin_reqt = data[1]["ReserveRegionalSchedules"][0].MrktReqt;
      this.reqtSched[1].cmin_sched = data[1]["ReserveRegionalSchedules"][0].Schedule;

      this.reqtSched[2].cmin_reqt = data[2]["ReserveRegionalSchedules"][0].MrktReqt;
      this.reqtSched[2].cmin_sched = data[2]["ReserveRegionalSchedules"][0].Schedule;

      let index_of_min = this.sortedUnitRegionMapping.findIndex(unit => unit.region === 2); // the first instance of region
      this.sortedUnitRegionMapping[index_of_min].price_ru = data[0]["ReserveRegionalSchedules"][0].Price;
      this.sortedUnitRegionMapping[index_of_min].price_rd = data[1]["ReserveRegionalSchedules"][0].Price;
      this.sortedUnitRegionMapping[index_of_min].price_cr = data[2]["ReserveRegionalSchedules"][0].Price;
    });
  }

  OpenEditRemarksModal(content: NgbModal, unitNumber:string, interval:string, remarks:string, isGenR:boolean, unit:string, index:number){
    if(unitNumber != '' && unitNumber != 'SELECT UNIT'){
      this.isGenRemarks = isGenR;
      this.selectedUnitNumber = unitNumber;
      // this.selectedPBInterval = interval;
      this.selectedPBRemarks = remarks;
      this.editremarksOf_index = index
      // this.selectedPBUnitType = unit;
      this.modalReference = this.modalService.open(content, {size: 'sm',centered:true});
    }
  }

  SaveRemarks() {
    // let dateTime;
    
    // if(this.selectedPBInterval == "60"){
    //   dateTime = moment(this.pbDate).add(1,'hour').format("MM/DD/YYYY HH") + ":00";
    // }else{
    //   dateTime = this.pbDate.format("MM/DD/YYYY HH") + ":" + this.selectedPBInterval;
    // }

    // if(this.pbHr == '24'){
    //   dateTime = moment(dateTime).add(1,'day').format("MM/DD/YYYY HH:mm");
    // }
    
    const payload = {
      // Timestamp: dateTime,
      UnitNumber: this.selectedUnitNumber,
      Value: this.selectedPBRemarks
    };
    console.log(payload, this.sortedUnitRegionMapping[this.editremarksOf_index].remarks);
    
    
    // if (this.isGenRemarks) {
      this.ReservePortfolioService.saveGeneralRemarks(payload).subscribe(data => {
        this.successMessage = "Remarks successfully saved!";
        this.sortedUnitRegionMapping[this.editremarksOf_index].remarks = this.selectedPBRemarks;
        this.userLogs('PB_General_Remarks: ' + this.selectedUnitNumber + '( ' + this.selectedPBRemarks + ' )');
        this.modalReference.close();
        this.timerMessage = setInterval(() => {
          this.successMessage = null;
          clearInterval(this.timerMessage);
        }, 3000);
      });
    // } else {
    //   this.traderDashboardService.saveRemarks(payload).subscribe(data => {
    //     this.successMessage = "Remarks successfully saved!";
    //     this.userLogs('PB_Remarks: ' + this.selectedUnitNumber + '( ' + this.selectedPBRemarks + ' ) | Interval: ' + dateTime);
    //     this.modalReference.close();
    //     this.timerMessage = setInterval(() => {
    //       this.successMessage = null;
    //       clearInterval(this.timerMessage);
    //       }, 3000);
    //       this.RefreshPBRemarks();
    //   });
    // }
  
  }

  userLogs(action:string){
    const data = {
      UserID: localStorage.getItem('UserID'),
      Action: action,
      ModuleID: 1
    };
    this.userService.userLogs(data).subscribe();
  }
}
