import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnitsService } from '../units/units.service';
import * as moment from 'moment';
import { faInfoCircle, faExclamationCircle,faCog,faCopy,faTimesCircle,faPaste,faCheck, } from '@fortawesome/free-solid-svg-icons';
import { BidsService } from './bids-viewer-export.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { jsPDF } from "jspdf";
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


imports: [
  CommonModule
]
@Component({
  selector: 'app-bids-viewer',
  templateUrl: './bids-viewer-export.component.html',
  styleUrls: ['./bids-viewer-export.component.scss']
})


export class BidsViewerExportComponent implements OnInit {

  faInfoCircle = faInfoCircle;
  faExclamationCircle = faExclamationCircle;
  faCog=faCog;
  faCopy=faCopy;
  faPaste=faPaste;
  faTimesCircle=faTimesCircle;
  faCheck=faCheck;
  unitId;
  unitNumber;
  unitConfig;
  offers: any[] = [];
  offer: any = null;
  isInvalidFile:boolean;
  hasRampRate: boolean = false;
  rampRate: any = null;
  bidHistoryId: number;
  bidArchiveData: any[] = [];
  uploadedBy: string;
  transactionId: string;
  transactionDate: string;
  controlModeValue:string;
  dateFormatted: string = '';
  successUploadMessage = null;
  transID:string;
  dateUploaded:string;
  Status:string;
  modalReference: NgbModalRef;
  isEdit:boolean;


  bidArchiveRows: any[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private unitService: UnitsService,
    private bidsService:BidsService,
    private http:HttpClient
  ) {
    
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bidHistoryId = +params['bidHistoryId'];
      this.unitNumber = params['unitNumber'];
      this.uploadedBy = params['uploadedBy'];
      this.transactionId = params['transactionId'];
      this.dateUploaded = decodeURIComponent(params['dateUploaded']);
      this.transactionDate = decodeURIComponent(params['transactionDate']);
      this.Status = decodeURIComponent(params['status']);
  
      this.loadBidArchive(this.bidHistoryId);
    });

    this.controlModeValue = 'A';
    this.isEdit = false;
    this.isInvalidFile = true;
  }

  getOfferByDate(): void {
    if (this.bidArchiveRows && this.bidArchiveRows.length > 0) {
      this.offers = this.bidArchiveRows.slice();
      this.offer = this.offers[0];
  
      if (!this.dateFormatted && this.offer && this.offer.Date) {
        this.dateFormatted = this.formatDate(this.offer.Date);
      }
  
      const selectedDate = this.dateFormatted ? this.dateFormatted.trim() : null;
  
      const match = selectedDate
        ? this.offers.find(o => this.formatDate(o.Date) === selectedDate)
        : null;
  
      if (match) {
        this.offer = match;
        this.isInvalidFile = false;
      } else {
        this.offer = null;
        this.isInvalidFile = true;
      }
  
    } else {
      this.offers = [];
      this.offer = null;
      this.isInvalidFile = true;
    }
  }

  loadBidArchive(bidHistoryId: number): void {
    this.bidsService.getBidArchiveByHistoryId(bidHistoryId).subscribe((result: any) => {
      this.offers = result.BidArchive || [];
      this.rampRate = result.RampRate || null;
    
      if (this.offers.length > 0) {
        setTimeout(() => {
          this.exportToPDF();
        }, 500); // slight delay to ensure bindings are ready
      } else {
        alert('Bid history is unavailable. Export function skipped due to missing data');
        window.close();
      }
    });
  }
  private clearAllData(bidHistoryId: number): void {
    this.bidArchiveRows = [];
    this.offers = [];
    this.offer = null;
    this.dateFormatted = '';
    this.isInvalidFile = true;
    this.hasRampRate = false;
  }

  formatDate(date) {
    return moment(date).format('YYYY-MM-DD');
  }

  exportToPDF(){

    const hasValidOffers = this.offers && this.offers.length > 0 && this.offers.some(o => {
      return o.P1 || o.Q1 || o.P2 || o.Q2 || o.P3 || o.Q3 || o.P4 || o.Q4 ||
             o.P5 || o.Q5 || o.P6 || o.Q6 || o.P7 || o.Q7 || o.P8 || o.Q8 ||
             o.P9 || o.Q9 || o.P10 || o.Q10 || o.P11 || o.Q11;
    });
    
    const hasValidRampRate = this.rampRate && (
      this.rampRate.RRMW1 || this.rampRate.RRMW2 || this.rampRate.RRMW3 ||
      this.rampRate.RRRU1 || this.rampRate.RRRU2 || this.rampRate.RRRU3 ||
      this.rampRate.RRRD1 || this.rampRate.RRRD2 || this.rampRate.RRRD3
    );
    
    if (!hasValidOffers && !hasValidRampRate) {
      alert('Bid history is unavailable. Export function skipped due to empty data fields.');
      window.close();
      return;
    }
    
    
    
    var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape" });
    let checkAS:boolean = false;

    const safeDate = moment(this.transactionDate, ['YYYY-MM-DD', 'YYYY-MM-DDTHH:mm:ss', moment.ISO_8601], true);
    const readableDate = safeDate.isValid() ? safeDate.format('YYYY-MM-DD') : 'N/A';
    const fileDate = safeDate.isValid() ? safeDate.format('YYYYMMDD') : 'nodate';
   /** BID Schedule */
    var result = [];
  
    let i=0; 
      for(let offer of this.offers){
        if(offer.AS_RU_P1 != null || offer.AS_RD_P1 != null || offer.AS_FR_P1 != null || offer.AS_DR_P1 != null){
          checkAS = true
        }

        const data = {
          id:stringValue(i),
          Hour:stringValue(offer.Interval),
          P1:stringValue(offer.P1),
          Q1:stringValue(offer.Q1),
          P2:stringValue(offer.P2),
          Q2:stringValue(offer.Q2),
          P3:stringValue(offer.P3),
          Q3:stringValue(offer.Q3),
          P4:stringValue(offer.P4),
          Q4:stringValue(offer.Q4),
          P5:stringValue(offer.P5),
          Q5:stringValue(offer.Q5),
          P6:stringValue(offer.P6),
          Q6:stringValue(offer.Q6),
          P7:stringValue(offer.P7),
          Q7:stringValue(offer.Q7),
          P8:stringValue(offer.P8),
          Q8:stringValue(offer.Q8),
          P9:stringValue(offer.P9),
          Q9:stringValue(offer.Q9),
          P10:stringValue(offer.P10),
          Q10:stringValue(offer.Q10),
          P11:stringValue(offer.P11),
          Q11:stringValue(offer.Q11),
          CMode:stringValue(offer.ControlMode),
        }
        result.push(data);
        i++;
      }

    function stringValue(value){
      let val=' ';
      if(value != null && value !== ""){
        val = value.toLocaleString('en-GB');
      }
      return val;
    }

    // function createHeaders(keys) {
    //   let resultH = [];
    //   for (var i = 0; i < keys.length; i += 1) {
    //     resultH.push({
    //       id: keys[i],
    //       name: keys[i],
    //       prompt: keys[i],
    //       width: 50,
    //       align: "center",
    //       padding: 0
    //     });
    //   }
    //   return resultH;
    // }
    
    let headers = [
      'Hour',
      'P1',
      'Q1',
      'P2',
      'Q2',
      'P3',
      'Q3',
      'P4',
      'Q4',
      'P5',
      'Q5',
      'P6',
      'Q6',
      'P7',
      'Q7',
      'P8',
      'Q8',
      'P9',
      'Q9',
      'P10',
      'Q10',
      'P11',
      'Q11',
      'CMode'
    ];
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text( "OFFER SCHEDULE" , 30, 10);
    doc.setFontSize(10);
    doc.text("Resource: " + this.unitNumber , 30, 15);
    doc.text("Trading Date: " + readableDate , 120, 15);
    doc.table(30, 20, result 
      ,headers
      , { autoSize: true
          , fontSize:8
          , headerBackgroundColor: "#e33f37"
          , headerTextColor:"white"
          , padding: 1
          });


    /*** Ramprate */
    const rrResult = [];

rrResult.push({
  Id: stringValue(0),
  BreakPoint: 'Break Point 1',
  MW: stringValue(this.rampRate && this.rampRate.RRMW1 || ''),
  RU: stringValue(this.rampRate && this.rampRate.RRRU1 || ''),
  RD: stringValue(this.rampRate && this.rampRate.RRRD1 || '')
});

rrResult.push({
  Id: stringValue(1),
  BreakPoint: 'Break Point 2',
  MW: stringValue(this.rampRate && this.rampRate.RRMW2 || ''),
  RU: stringValue(this.rampRate && this.rampRate.RRRU2 || ''),
  RD: stringValue(this.rampRate && this.rampRate.RRRD2 || '')
});

rrResult.push({
  Id: stringValue(2),
  BreakPoint: 'Break Point 3',
  MW: stringValue(this.rampRate && this.rampRate.RRMW3 || ''),
  RU: stringValue(this.rampRate && this.rampRate.RRRU3 || ''),
  RD: stringValue(this.rampRate && this.rampRate.RRRD3 || '')
});

    
    
    
    
    
    
    let rrHeaders = [
      'BreakPoint',
      'MW',
      'RU',
      'RD'
    ]
    doc.table(30, 154, rrResult 
      ,rrHeaders
      , { autoSize: true
          , fontSize:8
          , headerBackgroundColor: "#e33f37"
          , headerTextColor:"white"
          , padding: 2 
          });
    //console.log(this.offer);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("TransID: " + stringValue(this.transactionId) , 30, 190);
    doc.text("Date Uploaded: " + this.dateUploaded , 120, 190);
    doc.text("Uploaded By: " + stringValue(this.uploadedBy) , 210, 190);     
      
if(checkAS){
// Reserve BID
    var resultASRU = [];
    var resultASRD = [];
    var resultASFR = [];
    var resultASDR = [];
    i=0;
    for(let offer of this.offers){
      const dataRU = {
        id:stringValue(i),
        Hour:stringValue(offer.Interval),
        P1:stringValue(offer.AS_RU_Q1),
        Q1:stringValue(offer.AS_RU_P1),
        P2:stringValue(offer.AS_RU_Q2),
        Q2:stringValue(offer.AS_RU_P2),
        P3:stringValue(offer.AS_RU_Q3),
        Q3:stringValue(offer.AS_RU_P3),
        P4:stringValue(offer.AS_RU_Q4),
        Q4:stringValue(offer.AS_RU_P4),
        P5:stringValue(offer.AS_RU_Q5),
        Q5:stringValue(offer.AS_RU_P5),
      }
      const dataRD = {
        id:stringValue(i),
        Hour:stringValue(offer.Interval),
        P1:stringValue(offer.AS_RD_Q1),
        Q1:stringValue(offer.AS_RD_P1),
        P2:stringValue(offer.AS_RD_Q2),
        Q2:stringValue(offer.AS_RD_P2),
        P3:stringValue(offer.AS_RD_Q3),
        Q3:stringValue(offer.AS_RD_P3),
        P4:stringValue(offer.AS_RD_Q4),
        Q4:stringValue(offer.AS_RD_P4),
        P5:stringValue(offer.AS_RD_Q5),
        Q5:stringValue(offer.AS_RD_P5),
      }

      const dataFR = {
        id:stringValue(i),
        Hour:stringValue(offer.Interval),
        P1:stringValue(offer.AS_FR_Q1),
        Q1:stringValue(offer.AS_FR_P1),
        P2:stringValue(offer.AS_FR_Q2),
        Q2:stringValue(offer.AS_FR_P2),
        P3:stringValue(offer.AS_FR_Q3),
        Q3:stringValue(offer.AS_FR_P3),
        P4:stringValue(offer.AS_FR_Q4),
        Q4:stringValue(offer.AS_FR_P4),
        P5:stringValue(offer.AS_FR_Q5),
        Q5:stringValue(offer.AS_FR_P5),
      }

      const dataDR = {
        id:stringValue(i),
        Hour:stringValue(offer.Interval),
        P1:stringValue(offer.AS_DR_Q1),
        Q1:stringValue(offer.AS_DR_P1),
        P2:stringValue(offer.AS_DR_Q2),
        Q2:stringValue(offer.AS_DR_P2),
        P3:stringValue(offer.AS_DR_Q3),
        Q3:stringValue(offer.AS_DR_P3),
        P4:stringValue(offer.AS_DR_Q4),
        Q4:stringValue(offer.AS_DR_P4),
        P5:stringValue(offer.AS_DR_Q5),
        Q5:stringValue(offer.AS_DR_P5),
      }

      resultASRU.push(dataRU);
      resultASRD.push(dataRD);
      resultASFR.push(dataFR);
      resultASDR.push(dataDR);
      i++;
    }

    
    let headerAS = [
      'Hour',
      'P1',
      'Q1',
      'P2',
      'Q2',
      'P3',
      'Q3',
      'P4',
      'Q4',
      'P5',
      'Q5',
    ];
    const leftMargin = 30;
    const topMargin = 30;
    const colSpacing = 60;
    const colWidth = 80;
    
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("RESERVED", leftMargin, 15);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("AS RU", leftMargin, topMargin - 5);
    doc.table(leftMargin, topMargin, resultASRU, headerAS, {
      autoSize: true,
      fontSize: 8,
      headerBackgroundColor: "#e33f37",
      headerTextColor: "white",
      padding: 1
    });
    
    const col2X = leftMargin + colWidth + colSpacing;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("AS RD", col2X, topMargin - 5);
    doc.table(col2X, topMargin, resultASRD, headerAS, {
      autoSize: true,
      fontSize: 8,
      headerBackgroundColor: "#e33f37",
      headerTextColor: "white",
      padding: 1
    });
    
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("RESERVED", leftMargin, 15);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("AS FR", leftMargin, topMargin - 5);
    doc.table(leftMargin, topMargin, resultASFR, headerAS, {
      autoSize: true,
      fontSize: 8,
      headerBackgroundColor: "#e33f37",
      headerTextColor: "white",
      padding: 1
    });
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("AS DR", col2X, topMargin - 5);
    doc.table(col2X, topMargin, resultASDR, headerAS, {
      autoSize: true,
      fontSize: 8,
      headerBackgroundColor: "#e33f37",
      headerTextColor: "white",
      padding: 1
    });
    }
    doc.save(this.unitNumber + "_" + moment(this.transactionDate).format('YYYYMMDD') + ".pdf");
    setTimeout(() => {
      window.close();
    }, 1000);
  }
}
