import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnitsService } from '../units/units.service';
import * as moment from 'moment';
import { faInfoCircle, faExclamationCircle,faCog,faCopy,faTimesCircle,faPaste,faCheck, } from '@fortawesome/free-solid-svg-icons';
import { BidsService } from './bids.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { jsPDF } from "jspdf";
import { findIndex } from 'rxjs/operators';
import { UsersService } from '../users/users.service';
import { EnvService } from '../env.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bids',
  templateUrl: './bids.component.html',
  styleUrls: ['./bids.component.scss']
})

export class BidsComponent implements OnInit {
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
  offers;
  offer;
  copiedOffer;
  offersValidation;
  ramprateValidation;
  ramprateStandard;
  isInvalidFile:boolean;
  isValidatingFile:boolean;
  isUseOffer:boolean;
  isUseRR:boolean;
  isCreateBid:boolean;
  isPreviousDate:boolean;
  loading: boolean;
  bidLoading: boolean;
  isCopy:boolean = false;
  isPaste:boolean = false;
  isPasteActive:boolean;
  pmaxEntry:number;
  rrmaxEntry:number;
  pmax:number;
  rrmax:number;
  rrUp:number;
  rrDown:number;
  errorCounts:number = 0;

  controlModeValue:string;
  dateFormatted:string;
  dateCopyTo:string;
  dateToday:string;
  rrError:string;
  successMessage = null;
  successUploadMessage = null;
  transID:string;
  dateUploaded:string;
  uploadedBy:string;
  modalReference: NgbModalRef;
  isEdit:boolean;
  
  constructor(
    private route: ActivatedRoute,
    private unitService: UnitsService,
    private bidsService:BidsService,
    private modalService: NgbModal,
    private userService:UsersService,
    private envService:EnvService,
    private http:HttpClient
  ) {
    this.route.params.subscribe(param => {
      this.unitId = param.unitId;
      this.unitNumber = param.unitNumber;
    });
  }

  ngOnInit() {
    this.controlModeValue = 'A';
    this.isEdit=false;
    //this.getOffer();
    this.offer = [];
    this.unitService.getWebSettings(+this.unitId).subscribe(data => {
      this.unitConfig = data;
      console.log(this.unitConfig);
    }, error => {
      console.log(error.message);
    });

    //this.getOffer();
    this.dateFormatted = moment().format('YYYY-MM-DD');
    this.GetRRStandard();
    this.getOfferByDate();
    this.isInvalidFile = true;
  }

  setControlMode(val:string){
    this.controlModeValue = val;
    console.log(this.controlModeValue);
  }

  CopySchedule(){
    this.isCopy=false;
    this.isPasteActive = false;
    this.isPaste=false;
    for(let x of this.offers){
      if(x.IsCopied){
        this.isPasteActive = true;
      }
    }
  }

  ClearCopy(){
    for(let x of this.offers){
      x.IsCopied = false;
    }
  }

  ShowRRStandard(modal){
    this.modalReference =this.modalService.open(modal,{centered:true});
  }


  ShowControlMode(modal){
    this.modalReference =this.modalService.open(modal,{centered:true});
  }
  
  SaveRRStandard(){
    console.log(this.rrmax);
    if(this.rrUp == null){
      this.rrError = "Please fill ramprate up";
      return
    }
    if(this.rrDown == null){
      this.rrError = "Please fill ramprate down";
      return
    }
    if(this.rrmaxEntry == null){
      this.rrError = "Please fill ramprate max";
      return
    }
    if(this.pmaxEntry == null){
      this.rrError = "Please fill p max";
      return
    }

    if(this.rrUp > this.rrmax || this.rrDown > this.rrmax){
      this.rrError = "Standard must not exceed Ramprate Max.!";
      this.GetRRStandard();
      return
    }

    const payload = {
      UnitNumber:this.unitNumber,
      RRUp:this.rrUp,
      RRDown:this.rrDown,
      RRMax:this.rrmaxEntry,
      PMax:this.pmaxEntry
    }
    this.unitService.setRRStandard(payload).subscribe(data=>{
      this.ramprateStandard = data;
      this.rrUp = this.ramprateStandard.RRUp;
      this.rrDown = this.ramprateStandard.RRDown;
      this.rrmax = this.ramprateStandard.RRMax;
      this.pmax = this.ramprateStandard.PMax;
      this.rrmaxEntry = this.ramprateStandard.RRMax;
      this.pmaxEntry = this.ramprateStandard.PMax;
      this.PQValidation();
      this.modalReference.close();
    });
  }

  GetRRStandard(){
    this.unitService.getRRStandard(this.unitNumber).subscribe(data=>{
      this.ramprateStandard = data;
      this.rrUp = this.ramprateStandard.RRUp;
      this.rrDown = this.ramprateStandard.RRDown;
      this.rrmax = this.ramprateStandard.RRMax;
      this.pmax = this.ramprateStandard.PMax;
      this.rrmaxEntry = this.ramprateStandard.RRMax;
      this.pmaxEntry = this.ramprateStandard.PMax;
    });
  }

  ShowValidation(modal:NgbModal){
    this.modalReference =this.modalService.open(modal,{size:"lg",centered:true});
  }

  PasteSchedule(index){
    let CopiedOffer=[];
    let CoppiedOfferIndex = 0;
    for(let x of this.offers){
      if(x.IsCopied){
        CopiedOffer.push(JSON.parse(JSON.stringify(x)));
      }
    }

    let indexRange = (CopiedOffer.length-1) + index;
    let i = 0;
    for(let x of this.offers){
      let interval = x.Interval;
      let isCopied = x.IsCopied;
      if(i>=index && i <= indexRange){
        this.offers[i] = JSON.parse(JSON.stringify(CopiedOffer[CoppiedOfferIndex]));
        this.offers[i].Interval = interval;
        this.offers[i].IsCopied = isCopied;
        CoppiedOfferIndex++;
      }
      i++;
    }
  }

  PerLinePriceValidation(val1,val2){
    let result:boolean = false;
    
    //check if prices are not lesser than -10,000
    if(val1 < -10000 && val1 != null){
      result = true;
    }

    //check if prices are not exceeds in 32,000
    if(val1 > 32000 && val1 != null){
      result = true;
    }

     //check if prices are incremental
     if((val1 >= val2) && val2!=null){
      result = true;
     }

     //check prices maximum of decimal 2 only
     if(this.CountDecimalPlaces(val1) > 2){
      result = true;
     }

     //check outlier value
     if(val2 != null && val1==null){
      result =true;
    }
    return result
  }

  PerLineQuantityValidation(val1,val2){
    let result:boolean = false;

    if((val1 >= val2) && val2!=null){
      result =true;
    }

    if(this.CountDecimalPlaces(val1) > 1){
      result =true;
    }

    if(val1 > 0 && val1 < 1){
      result =true;
    }

    if(val1 > +this.pmax){
      result =true;
    }

    if(val2 - val1 <1 && val2!=null){
      result =true;
    }

    if(val2 != null && val1==null){
      result =true;
    }

    return result
  }

  PerLineRRValidation(val){
    let result:boolean = false;
    if(this.CountDecimalPlaces(val) > 1){
      result = true;
    }
    if(val > +this.rrmax){
      result = true;
    }

    return result
  }

  PerLineRRUpStandardValidation(val){
    let result:boolean = false;
    
    if(val > +this.rrUp){
      result = true;
    }

    return result
  }

  PerLineRRDownStandardValidation(val){
    let result:boolean = false;
    
    if(val > +this.rrDown){
      result = true;
    }

    return result
  }

  PQValidation(){
    this.isValidatingFile = true;
    this.offersValidation=[];
    this.ramprateValidation = [];
    let validationRules;
    ///let rule;
    //rule=[];
    let checkInterval=0;
    let msg;

    let offerErrorCount:number = 0;
      let intevalErrorCount:number = 0;
      let rrErrorCount:number = 0;
      //validationRules = data;
      //rule = validationRules.find(val => val.UnitID == +this.unitId)
      //this.pmax = +rule.PMAX;
      //this.rrmax = +rule.RRMAX;

      for(let data of this.offers){
        msg = [];
        intevalErrorCount = 0;
        if(checkInterval == data.Interval){
          msg.push({msg:'Duplicate Interval'})
          intevalErrorCount++;
        }
        checkInterval = data.Interval;

        //check if Price 1 and Price 2 are equal
        if(data.P1 != data.P2){
          msg.push({msg:'Price 1 and Price 2 are not equal'})
          intevalErrorCount++;
        }
        //if(data.Q1 != 0 && data.Q1 != null){
        //  msg.push({msg:'Quantity 1 must always equals to 0'})
        //  intevalErrorCount++;
        //}
        
        //check if prices are not lesser than -10,000
        if(data.P1 < -10000 && data.P1 != null){
          msg.push({msg:'Price 1 is lesser than -10,000'})
          intevalErrorCount++;
        }
        if(data.P2 < -10000 && data.P2 != null){
          msg.push({msg:'Price 2 is lesser than -10,000'})
          intevalErrorCount++;
        }
        if(data.P3 < -10000 && data.P3 != null){
          msg.push({msg:'Price 3 is lesser than -10,000'})
          intevalErrorCount++;
        }
        if(data.P4 < -10000 && data.P4 != null){
          msg.push({msg:'Price 4 is lesser than -10,000'})
          intevalErrorCount++;
        }
        if(data.P5 < -10000 && data.P5 != null){
          msg.push({msg:'Price 5 is lesser than -10,000'})
          intevalErrorCount++;
        }
        if(data.P6 < -10000 && data.P6 != null){
          msg.push({msg:'Price 6 is lesser than -10,000'})
          intevalErrorCount++;
        }
        if(data.P7 < -10000 && data.P7 != null){
          msg.push({msg:'Price 7 is lesser than -10,000'})
          intevalErrorCount++;
        }
        if(data.P8 < -10000 && data.P8 != null){
          msg.push({msg:'Price 8 is lesser than -10,000'})
          intevalErrorCount++;
        }
        if(data.P9 < -10000 && data.P9 != null){
          msg.push({msg:'Price 9 is lesser than -10,000'})
          intevalErrorCount++;
        }
        if(data.P10 < -10000 && data.P10 != null){
          msg.push({msg:'Price 10 is lesser than -10,000'})
          intevalErrorCount++;
        }
        if(data.P11 < -10000 && data.P11 != null){
          msg.push({msg:'Price 11 is lesser than -10,000'})
          intevalErrorCount++;
        }
  
        //check if prices are not exceeds in 32,000
        if(data.P1 > 32000 && data.P1 != null){
          msg.push({msg:'Price 1 is greater than 32,000'})
          intevalErrorCount++;
        }
        if(data.P2 > 32000 && data.P2 != null){
          msg.push({msg:'Price 2 is greater than 32,000'})
          intevalErrorCount++;
        }
        if(data.P3 > 32000 && data.P3 != null){
          msg.push({msg:'Price 3 is greater than 32,000'})
          intevalErrorCount++;
        }
        if(data.P4 > 32000 && data.P4 != null){
          msg.push({msg:'Price 4 is greater than 32,000'})
          intevalErrorCount++;
        }
        if(data.P5 > 32000 && data.P5 != null){
          msg.push({msg:'Price 5 is greater than 32,000'})
          intevalErrorCount++;
        }
        if(data.P6 > 32000 && data.P6 != null){
          msg.push({msg:'Price 6 is greater than 32,000'})
          intevalErrorCount++;
        }
        if(data.P7 > 32000 && data.P7 != null){
          msg.push({msg:'Price 7 is greater than 32,000'})
          intevalErrorCount++;
        }
        if(data.P8 > 32000 && data.P8 != null){
          msg.push({msg:'Price 8 is greater than 32,000'})
          intevalErrorCount++;
        }
        if(data.P9 > 32000 && data.P9 != null){
          msg.push({msg:'Price 9 is greater than 32,000'})
          intevalErrorCount++;
        }
        if(data.P10 > 32000 && data.P10 != null){
          msg.push({msg:'Price 10 is greater than 32,000'})
          intevalErrorCount++;
        }
        if(data.P11 > 32000 && data.P11 != null){
          msg.push({msg:'Price 11 is greater than 32,000'})
          intevalErrorCount++;
        }
  
        //check if prices are incremental
        if((data.P2 >= data.P3) && data.P3!=null){
          msg.push({msg:'Price 2 must be lesser than Price 3'})
          intevalErrorCount++;
        }
        if(data.P3 >= data.P4 && data.P4!=null){
          msg.push({msg:'Price 3 must be lesser than Price 4'})
          intevalErrorCount++;
        }
        if(data.P4 >= data.P5 && data.P5!=null){
          msg.push({msg:'Price 4 must be lesser than Price 5'})
          intevalErrorCount++;
        }
        if(data.P5 >= data.P6 && data.P6!=null){
          msg.push({msg:'Price 5 must be lesser than Price 6'})
          intevalErrorCount++;
        }
        if(data.P6 >= data.P7 && data.P7!=null){
          msg.push({msg:'Price 6 must be lesser than Price 7'})
          intevalErrorCount++;
        }
        if(data.P7 >= data.P8 && data.P8!=null){
          msg.push({msg:'Price 7 must be lesser than Price 8'})
          intevalErrorCount++;
        }
        if(data.P8 >= data.P9 && data.P9!=null){
          msg.push({msg:'Price 8 must be lesser than Price 9'})
          intevalErrorCount++;
        }
        if(data.P9 >= data.P10 && data.P10!=null){
          msg.push({msg:'Price 9 must be lesser than Price 10'})
          intevalErrorCount++;
        }
        if(data.P10 >= data.P11 && data.P11!=null){
          msg.push({msg:'Price 10 must be lesser than Price 11'})
          intevalErrorCount++;
        }

        //check if Quantity are incremental
        if((data.Q2 >= data.Q3) && data.Q3!=null){
          msg.push({msg:'Quantity 2 must be lesser than Quantity 3'})
          intevalErrorCount++;
        }
        if(data.Q3 >= data.Q4 && data.Q4!=null){
          msg.push({msg:'Quantity 3 must be lesser than Quantity 4'})
          intevalErrorCount++;
        }
        if(data.Q4 >= data.Q5 && data.Q5!=null){
          msg.push({msg:'Quantity 4 must be lesser than Quantity 5'})
          intevalErrorCount++;
        }
        if(data.Q5 >= data.Q6 && data.Q6!=null){
          msg.push({msg:'Quantity 5 must be lesser than Quantity 6'})
          intevalErrorCount++;
        }
        if(data.Q6 >= data.Q7 && data.Q7!=null){
          msg.push({msg:'Quantity 6 must be lesser than Quantity 7'})
          intevalErrorCount++;
        }
        if(data.Q7 >= data.Q8 && data.Q8!=null){
          msg.push({msg:'Quantity 7 must be lesser than Quantity 8'})
          intevalErrorCount++;
        }
        if(data.Q8 >= data.Q9 && data.Q9!=null){
          msg.push({msg:'Quantity 8 must be lesser than Quantity 9'})
          intevalErrorCount++;
        }
        if(data.Q9 >= data.Q10 && data.Q10!=null){
          msg.push({msg:'Quantity 9 must be lesser than Quantity 10'})
          intevalErrorCount++;
        }
        if(data.Q10 >= data.Q11 && data.Q11!=null){
          msg.push({msg:'Quantity 10 must be lesser than Quantity 11'})
          intevalErrorCount++;
        }

        //check if diff of Quantities are equal or greater than 1
        if((data.Q3 - data.Q2) <1 && data.Q3!=null){
          msg.push({msg:'Minimum block size must be equal to 1'})
          intevalErrorCount++;
        }
        if(data.Q4 - data.Q3 <1 && data.Q4!=null){
          msg.push({msg:'Minimum block size must be equal to 1'})
          intevalErrorCount++;
        }
        if(data.Q5 - data.Q4 <1 && data.Q5!=null){
          msg.push({msg:'Minimum block size must be equal to 1'})
          intevalErrorCount++;
        }
        if(data.Q6 - data.Q5 <1 && data.Q6!=null){
          msg.push({msg:'Minimum block size must be equal to 1'})
          intevalErrorCount++;
        }
        if(data.Q7 - data.Q6 <= 1 && data.Q7!=null){
          msg.push({msg:'Minimum block size must be equal to 1'})
          intevalErrorCount++;
        }
        if(data.Q8 - data.Q7 <1 && data.Q8!=null){
          msg.push({msg:'Minimum block size must be equal to 1'})
          intevalErrorCount++;
        }
        if(data.Q9 - data.Q8 <1 && data.Q9!=null){
          msg.push({msg:'Minimum block size must be equal to 1'})
          intevalErrorCount++;
        }
        if(data.Q10 - data.Q9 <1 && data.Q10!=null){
          msg.push({msg:'Minimum block size must be equal to 1'})
          intevalErrorCount++;
        }
        if(data.Q11 - data.Q10 <1 && data.Q11!=null){
          msg.push({msg:'Minimum block size must be equal to 1'})
          intevalErrorCount++;
        }
  
        //check prices maximum of decimal 2 only
        if(this.CountDecimalPlaces(data.P1) > 2){
          msg.push({msg:'Maximum of 2 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.P2) > 2){
          msg.push({msg:'Maximum of 2 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.P3) > 2){
          msg.push({msg:'Maximum of 2 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.P4) > 2){
          msg.push({msg:'Maximum of 2 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.P5) > 2){
          msg.push({msg:'Maximum of 2 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.P6) > 2){
          msg.push({msg:'Maximum of 2 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.P7) > 2){
          msg.push({msg:'Maximum of 2 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.P8) > 2){
          msg.push({msg:'Maximum of 2 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.P9) > 2){
          msg.push({msg:'Maximum of 2 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.P10) > 2){
          msg.push({msg:'Maximum of 2 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.P11) > 2){
          msg.push({msg:'Maximum of 2 decimal places'})
          intevalErrorCount++;
        }

        //check Quantity maximum of decimal 1 only
        if(this.CountDecimalPlaces(data.Q1) > 1){
          msg.push({msg:'Maximum of 1 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.Q2) > 1){
          msg.push({msg:'Maximum of 1 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.Q3) > 1){
          msg.push({msg:'Maximum of 1 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.Q4) > 1){
          msg.push({msg:'Maximum of 1 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.Q5) > 1){
          msg.push({msg:'Maximum of 1 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.Q6) > 1){
          msg.push({msg:'Maximum of 1 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.Q7) > 1){
          msg.push({msg:'Maximum of 1 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.Q8) > 1){
          msg.push({msg:'Maximum of 1 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.Q9) > 1){
          msg.push({msg:'Maximum of 1 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.Q10) > 1){
          msg.push({msg:'Maximum of 1 decimal places'})
          intevalErrorCount++;
        }
        if(this.CountDecimalPlaces(data.Q11) > 1){
          msg.push({msg:'Maximum of 1 decimal places'})
          intevalErrorCount++;
        }

        //check if quantities are not between 0 and 1
        if(data.Q1 > 0 && data.Q1 < 1){
          msg.push({msg:'Quantity 1 is in between of 0 to 1'})
          intevalErrorCount++;
        }
        if(data.Q2 > 0 && data.Q2 < 1){
          msg.push({msg:'Quantity 2 is in between of 0 to 1'})
          intevalErrorCount++;
        }
        if(data.Q3 > 0 && data.Q3 < 1){
          msg.push({msg:'Quantity 3 is in between of 0 to 1'})
          intevalErrorCount++;
        }
        if(data.Q4 > 0 && data.Q4 < 1){
          msg.push({msg:'Quantity 4 is in between of 0 to 1'})
          intevalErrorCount++;
        }
        if(data.Q5 > 0 && data.Q5 < 1){
          msg.push({msg:'Quantity 5 is in between of 0 to 1'})
          intevalErrorCount++;
        }
        if(data.Q6 > 0 && data.Q6 < 1){
          msg.push({msg:'Quantity 6 is in between of 0 to 1'})
          intevalErrorCount++;
        }
        if(data.Q7 > 0 && data.Q7 < 1){
          msg.push({msg:'Quantity 7 is in between of 0 to 1'})
          intevalErrorCount++;
        }
        if(data.Q8 > 0 && data.Q8 < 1){
          msg.push({msg:'Quantity 8 is in between of 0 to 1'})
          intevalErrorCount++;
        }
        if(data.Q9 > 0 && data.Q9 < 1){
          msg.push({msg:'Quantity 9 is in between of 0 to 1'})
          intevalErrorCount++;
        }
        if(data.Q10 > 0 && data.Q10 < 1){
          msg.push({msg:'Quantity 10 is in between of 0 to 1'})
          intevalErrorCount++;
        }
        if(data.Q11 > 0 && data.Q11 < 1){
          msg.push({msg:'Quantity 11 is in between of 0 to 1'})
          intevalErrorCount++;
        }

        //check outlier values
        if((data.P2 != null && data.P1 == null) || (data.Q2 != null && data.Q1 == null) || (data.Q2 != null && data.P2 == null) || (data.P2 != null && data.Q2 == null)){
          msg.push({msg:'P2/Q2 outlier value'})
          intevalErrorCount++;
        }
        if((data.P3 != null && data.P2 == null) || (data.Q3 != null && data.Q2 == null) || (data.Q3 != null && data.P3 == null) || (data.P3 != null && data.Q3 == null)){
          msg.push({msg:'P3/Q3 outlier value'})
          intevalErrorCount++;
        }
        if((data.P4 != null && data.P3 == null) || (data.Q4 != null && data.Q3 == null) || (data.Q4 != null && data.P4 == null) || (data.P4 != null && data.Q4 == null)){
          msg.push({msg:'P4/Q4 outlier value'})
          intevalErrorCount++;
        }
        if((data.P5 != null && data.P4 == null) || (data.Q5 != null && data.Q4 == null) || (data.Q5 != null && data.P5 == null) || (data.P5 != null && data.Q5 == null)){
          msg.push({msg:'P5/Q5 outlier value'})
          intevalErrorCount++;
        }
        if((data.P6 != null && data.P5 == null) || (data.Q6 != null && data.Q5 == null) || (data.Q6 != null && data.P6 == null) || (data.P6 != null && data.Q6 == null)){
          msg.push({msg:'P6/Q6 outlier value'})
          intevalErrorCount++;
        }
        if((data.P7 != null && data.P6 == null) || (data.Q7 != null && data.Q6 == null) || (data.Q7 != null && data.P7 == null) || (data.P7 != null && data.Q7 == null)){
          msg.push({msg:'P7/Q7 outlier value'})
          intevalErrorCount++;
        }
        if((data.P8 != null && data.P7 == null) || (data.Q8 != null && data.Q7 == null) || (data.Q8 != null && data.P8 == null) || (data.P8 != null && data.Q8 == null)){
          msg.push({msg:'P8/Q8 outlier value'})
          intevalErrorCount++;
        }
        if((data.P9 != null && data.P8 == null) || (data.Q9 != null && data.Q8 == null) || (data.Q9 != null && data.P9 == null) || (data.P9 != null && data.Q9 == null)){
          msg.push({msg:'P9/Q9 outlier value'})
          intevalErrorCount++;
        }
        if((data.P10 != null && data.P9 == null) || (data.Q10 != null && data.Q9 == null) || (data.Q10 != null && data.P10 == null) || (data.P10 != null && data.Q10 == null)){
          msg.push({msg:'P10/Q10 outlier value'})
          intevalErrorCount++;
        }
        if((data.P11 != null && data.P10 == null) || (data.Q11 != null && data.Q10 == null) || (data.Q11 != null && data.P11 == null) || (data.P11 != null && data.Q11 == null)){
          msg.push({msg:'P11/Q11 outlier value'})
          intevalErrorCount++;
        }

        //check if quantities are not exceeds PMax
        if(data.Q1 > +this.pmax){
          msg.push({msg:'Quantity 1 exceeded ' + this.pmax + ' MW'})
          intevalErrorCount++;
        }
        if(data.Q2 > +this.pmax){
          msg.push({msg:'Quantity 2 exceeded ' + this.pmax + ' MW'})
          intevalErrorCount++;
        }
        if(data.Q3 > +this.pmax){
          msg.push({msg:'Quantity 3 exceeded ' + this.pmax + ' MW'})
          intevalErrorCount++;
        }
        if(data.Q4 > +this.pmax){
          msg.push({msg:'Quantity 4 exceeded ' + this.pmax + ' MW'})
          intevalErrorCount++;
        }
        if(data.Q5 > +this.pmax){
          msg.push({msg:'Quantity 5 exceeded ' + this.pmax + ' MW'})
          intevalErrorCount++;
        }
        if(data.Q6 > +this.pmax){
          msg.push({msg:'Quantity 6 exceeded ' + this.pmax + ' MW'})
          intevalErrorCount++;
        }
        if(data.Q7 > +this.pmax){
          msg.push({msg:'Quantity 7 exceeded ' + this.pmax + ' MW'})
          intevalErrorCount++;
        }
        if(data.Q8 > +this.pmax){
          msg.push({msg:'Quantity 8 exceeded ' + this.pmax + ' MW'})
          intevalErrorCount++;
        }
        if(data.Q9 > +this.pmax){
          msg.push({msg:'Quantity 9 exceeded ' + this.pmax + ' MW'})
          intevalErrorCount++;
        }
        if(data.Q10 > +this.pmax){
          msg.push({msg:'Quantity 10 exceeded ' + this.pmax + ' MW'})
          intevalErrorCount++;
        }
        if(data.Q11 > +this.pmax){
          msg.push({msg:'Quantity 11 exceeded ' + this.pmax + ' MW'})
          intevalErrorCount++;
        }
  
        
        if(intevalErrorCount > 0){
          let payload = {
            interval: data.Interval,
            messages: msg
          };
    
          this.offersValidation.push(payload);
        }

        offerErrorCount+=intevalErrorCount;
      }

      let msgrr=[];
      
      //check decimal place for RR
      
      if(this.CountDecimalPlaces(this.offer.RRU1) > 1){
        msgrr.push({msg:'Breakpoint 1 RU has more than 1 decimal places'})
        rrErrorCount++;
      } 
      if(this.CountDecimalPlaces(this.offer.RRD1) > 1){
        msgrr.push({msg:'Breakpoint 1 RD has more than 1 decimal places'})
        rrErrorCount++;
      } 
      if(this.CountDecimalPlaces(this.offer.RRU2) > 1){
        msgrr.push({msg:'Breakpoint 2 RU has more than 1 decimal places'})
        rrErrorCount++;
      } 
      if(this.CountDecimalPlaces(this.offer.RRD2) > 1){
        msgrr.push({msg:'Breakpoint 2 RD has more than 1 decimal places'})
        rrErrorCount++;
      } 
      if(this.CountDecimalPlaces(this.offer.RRU3) > 1){
        msgrr.push({msg:'Breakpoint 3 RU has more than 1 decimal places'})
        rrErrorCount++;
      } 
      if(this.CountDecimalPlaces(this.offer.RRD3) > 1){
        msgrr.push({msg:'Breakpoint 3 RD has more than 1 decimal places'})
        rrErrorCount++;
      } 
      //if(this.CountDecimalPlaces(this.offer.RRU4) > 1){
      //  msgrr.push({msg:'Breakpoint 4 RU has more than 1 decimal places'})
      //  rrErrorCount++;
      //} 
      //if(this.CountDecimalPlaces(this.offer.RRD4) > 1){
      //  msgrr.push({msg:'Breakpoint 4 RD has more than 1 decimal places'})
      //  rrErrorCount++;
      ///} 
      //if(this.CountDecimalPlaces(this.offer.RRU5) > 1){
      //  msgrr.push({msg:'Breakpoint 5 RU has more than 1 decimal places'})
      //  rrErrorCount++;
      //} 
      //if(this.CountDecimalPlaces(this.offer.RRD5) > 1){
      //  msgrr.push({msg:'Breakpoint 5 RD has more than 1 decimal places'})
      //  rrErrorCount++;
      //}
      
      //check if exceeds rrmax
      if(this.offer.RRU1 > +this.rrmax){
        msgrr.push({msg:'Breakpoint 1 RU has exceeded ' + this.rrmax + ' MW'})
        rrErrorCount++;
      } 
      if(this.offer.RRD1 > +this.rrmax){
        msgrr.push({msg:'Breakpoint 1 RD has exceeded ' + this.rrmax + ' MW'})
        rrErrorCount++;
      } 
      if(this.offer.RRU2 > +this.rrmax){
        msgrr.push({msg:'Breakpoint 2 RU has exceeded ' + this.rrmax + ' MW'})
        rrErrorCount++;
      } 
      if(this.offer.RRD2 > +this.rrmax){
        msgrr.push({msg:'Breakpoint 2 RD has exceeded ' + this.rrmax + ' MW'})
        rrErrorCount++;
      } 
      if(this.offer.RRU3 > +this.rrmax){
        msgrr.push({msg:'Breakpoint 3 RU has exceeded ' + this.rrmax + ' MW'})
        rrErrorCount++;
      } 
      if(this.offer.RRD3 > +this.rrmax){
        msgrr.push({msg:'Breakpoint 3 RD has exceeded ' + this.rrmax + ' MW'})
        rrErrorCount++;
      } 
      //if(this.offer.RRU4 > +this.rrmax){
      //  msgrr.push({msg:'Breakpoint 4 RU has exceeded ' + this.rrmax + ' MW'})
      //  rrErrorCount++;
      //} 
      //if(this.offer.RRD4 > +this.rrmax){
      //  msgrr.push({msg:'Breakpoint 4 RD has exceeded ' + this.rrmax + ' MW'})
      //  rrErrorCount++;
      //} 
      //if(this.offer.RRU5 > +this.rrmax){
      //  msgrr.push({msg:'Breakpoint 5 RU has exceeded ' + this.rrmax + ' MW'})
      //  rrErrorCount++;
      //} 
      //if(this.offer.RRD5 > +this.rrmax){
      //  msgrr.push({msg:'Breakpoint 5 RD has exceeded ' + this.rrmax + ' MW'})
      //  rrErrorCount++;
      //}
      

      //Check Standard
      /*if(this.offer.RRU1 > +this.rrUp){
        msgrr.push({msg:'Breakpoint 1 RU has exceeded standard: ' + this.rrUp + ' MW'})
        rrErrorCount++;
      } 
      if(this.offer.RRD1 > +this.rrDown){
        msgrr.push({msg:'Breakpoint 1 RD has exceeded standard' + this.rrDown + ' MW'})
        rrErrorCount++;
      } 
      if(this.offer.RRU2 > +this.rrUp){
        msgrr.push({msg:'Breakpoint 2 RU has exceeded standard: ' + this.rrUp + ' MW'})
        rrErrorCount++;
      } 
      if(this.offer.RRD2 > +this.rrDown){
        msgrr.push({msg:'Breakpoint 2 RD has exceeded standard' + this.rrDown + ' MW'})
        rrErrorCount++;
      } 
      if(this.offer.RRU3 > +this.rrUp){
        msgrr.push({msg:'Breakpoint 3 RU has exceeded standard: ' + this.rrUp + ' MW'})
        rrErrorCount++;
      } 
      if(this.offer.RRD3 > +this.rrDown){
        msgrr.push({msg:'Breakpoint 3 RD has exceeded standard' + this.rrDown + ' MW'})
        rrErrorCount++;
      } */

      this.ramprateValidation = msgrr;
      this.errorCounts = rrErrorCount + offerErrorCount;
      //console.log(this.errorCounts);
      //console.log(this.ramprateValidation);
      //console.log(this.offersValidation.length);
      this.isValidatingFile = false;
      //this.modalReference =this.modalService.open(modal,{size:"lg"});

    //this.bidsService.getOffersValidation().subscribe(data=>{
      
    //});
    
  }

  BlankBidModal(modal){
    this.modalReference =this.modalService.open(modal,{centered:true});
  }

  BlankOffer(){
    if(this.dateFormatted < moment().format('YYYY-MM-DD')){
      this.isPreviousDate = true;
    }else{
      this.isPreviousDate = false;
    }
    this.isCreateBid = true;
    this.unitService.createOffer(this.unitNumber,this.dateFormatted,null,false,false).subscribe(data=>{
      this.offers = data;
      if(this.offers.length > 0){
        this.offer = this.offers[0];
        this.dateFormatted = this.formatDate(this.offer.Date);
        this.transID = this.offer.TransID;
        this.dateUploaded = this.offer.DateTimeSubmitted;
        this.uploadedBy = this.offer.UploadedBy;
        this.isInvalidFile = false;
        this.successUploadMessage = "Blank BID Schedule Created.";
        this.isCreateBid = false;
        this.modalReference.close();
        this.SetTimeoutSuccessUploadMessage();
        
      }else{
        this.isInvalidFile = true;
        this.offer = [];
        this.offers = [];
        this.isCreateBid = false;
      }
    });
  }

  CopyOfferRR(){
    if(this.dateFormatted < moment().format('YYYY-MM-DD')){
      this.isPreviousDate = true;
    }else{
      this.isPreviousDate = false;
    }
    this.isCreateBid = true;
    this.unitService.createOffer(this.unitNumber,this.dateCopyTo,this.dateFormatted,this.isUseOffer,this.isUseRR).subscribe(data=>{
      this.offers = data;
      if(this.offers.length > 0){
        this.offer = this.offers[0];
        this.dateFormatted = this.formatDate(this.offer.Date);
        this.isInvalidFile = false;
        this.successUploadMessage = "BID Schedule Created.";
        this.transID = this.offer.TransID;
        this.dateUploaded = this.offer.DateTimeSubmitted;
        this.uploadedBy = this.offer.UploadedBy;
        this.isCreateBid = false;
        this.modalReference.close();
        this.SetTimeoutSuccessUploadMessage();
      }else{
        this.isInvalidFile = true;
        this.offer = [];
        this.offers = [];
        this.isCreateBid = false;
      }
    });
    
  }

  CopyBidModal(modal){
    this.dateCopyTo = moment().format('YYYY-MM-DD');
    this.isUseOffer = true;
    this.isUseRR = true;
    this.modalReference =this.modalService.open(modal,{centered:true});
  }

  ShowSaveChanges(modal){
    this.modalReference =this.modalService.open(modal,{centered:true});
  }

  SaveOfferChages(){
    this.unitService.updateOffer(this.unitId,this.unitNumber,this.offers).subscribe(data=>{
      this.modalReference.close();
    });
  }

  CountDecimalPlaces(num1:number){
    const decimalCount = num => {
      // Convert to String
      const numStr = String(num);
      // String Contains Decimal
      if (numStr.includes('.')) {
          return numStr.split('.')[1].length;
      };
      // String Does Not Contain Decimal
      return 0;
    }
    return decimalCount(num1);
  }

  getFileName(file) {
    document.querySelector('.custom-file-label').innerHTML = file.files[0].name;
    if(this.unitNumber + ".xlsx" != file.files[0].name ){
      this.successMessage = "Invalid Filename. Filename must be equal to Unit/Resource Number (" + this.unitNumber + ".xlsx). Please try again.";
      this.isInvalidFile = true;
    }else{
      this.successMessage = null;
      this.isInvalidFile = false;
    }
  }

  saveBids(file) {
    this.loading = true;
    const fd = new FormData();

    fd.append('File', file.files[0]);
    fd.append('UnitID', this.unitId);
    fd.append('BidType', this.unitConfig.BidType);

    this.unitService.uploadBids(fd).subscribe(data => {
      this.getOffer();
      this.loading = false;
      this.successUploadMessage = "Bid File Uploaded.";
      this.SetTimeoutSuccessUploadMessage();
    }, error => {
      this.loading = false;
      console.log(error.message);
    });
  }

  SetTimeoutSuccessUploadMessage(){
    setTimeout(() => {
      this.successUploadMessage = "";
    }, 3000);
  }

  getOfferByDate(){
    this.errorCounts = 0;
    if(this.dateFormatted < moment().format('YYYY-MM-DD')){
      this.isPreviousDate = true;
    }else{
      this.isPreviousDate = false;
    }

    this.unitService.getOfferByDate(this.unitNumber, this.dateFormatted).subscribe(data=>{
      this.offers = data;
      if(this.offers.length > 0){
        this.offer = this.offers[0];
        this.dateFormatted = this.formatDate(this.offer.Date);
        this.transID = this.offer.TransID;
        this.dateUploaded = this.offer.DateTimeSubmitted;
        this.uploadedBy = this.offer.UploadedBy;
        this.isInvalidFile = false;
        this.PQValidation();
      }else{
        this.isInvalidFile = true;
        this.offer = [];
        this.offers = [];
        this.transID = "";
        this.dateUploaded ="";
        this.uploadedBy = "";
      }
    });
  }

  getOffer() {
    this.errorCounts = 0;
    this.unitService.getOffer(this.unitId, this.unitNumber).subscribe(data => {
      this.offers = data;
      if(this.offers.length > 0){
        this.offer = this.offers[0];
        this.dateFormatted = this.formatDate(this.offer.Date);
        this.transID = this.offer.TransID;
        this.dateUploaded = this.offer.DateTimeSubmitted;
        this.uploadedBy = this.offer.UploadedBy;
        this.isInvalidFile = false;
        this.PQValidation();
      }else{
        this.isInvalidFile = true;
        this.offer = [];
        this.offers=[];
        this.transID = "";
        this.dateUploaded ="";
        this.uploadedBy = "";
      }
      
    }, error => {
      console.log(error.message);
    });
  }

  updateOffer(){
    for(let offer of this.offers){
      offer.DateFormatted = this.dateFormatted;
      offer.RampQuantity1 = this.offer.RampQuantity1;
      offer.RRU1 = this.offer.RRU1;
      offer.RRD1 = this.offer.RRD1;
      offer.RampQuantity2 = this.offer.RampQuantity2;
      offer.RRU2 = this.offer.RRU2;
      offer.RRD2 = this.offer.RRD2;
      offer.RampQuantity3 = this.offer.RampQuantity3;
      offer.RRU3 = this.offer.RRU3;
      offer.RRD3 = this.offer.RRD3;
      offer.RampQuantity4 = this.offer.RampQuantity4;
      offer.RRU4 = this.offer.RRU4;
      offer.RRD4 = this.offer.RRD4;
      offer.RampQuantity5 = this.offer.RampQuantity5;
      offer.RRU5 = this.offer.RRU5;
      offer.RRD5 = this.offer.RRD5;
      offer.DateFormatted = this.offer.DateFormatted;
    }
  }


  downloadXML(){
    this.updateOffer();
    this.unitService.downloadBid(this.unitId, this.unitNumber, this.offers,this.controlModeValue).subscribe(data => {
      //this.offers = data['offers'];
      this.downloadFile(this.unitId);
    });
  }

  downloadFile(unitId: number): void {
    const url = `${this.envService.apiUrlV1}XMLFiles/BidOffer${unitId}.xml`;

    this.http.get(url, { responseType: 'blob' }).subscribe(
      (response: Blob) => {
        // Create a blob URL and trigger a download
        const blobUrl = window.URL.createObjectURL(response);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'BidOffer.xml';
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      },
      error => {
        console.error('Error downloading file:', error);
        // Handle the error as needed
      }
    );
  }

  upload() {
    
    this.updateOffer();
    this.bidLoading = true;
    this.offers[0].UploadedBy = localStorage.getItem('currentUserName');
    
    this.unitService.createBid(this.unitId, this.unitNumber, this.offers, this.controlModeValue).subscribe(data => {
      this.modalReference.close();
      this.successMessage = data['message'];
      this.bidLoading = false;
      window.scrollTo({
        top: 0,
       behavior: 'smooth'
      });
      this.offers = data['offers'];
      this.offer = this.offers[0];
      this.dateFormatted = this.formatDate(this.offer.Date);
      this.transID = this.offer.TransID;
      this.dateUploaded = this.offer.DateTimeSubmitted;
      this.uploadedBy = this.offer.UploadedBy;

    }, error => {
      this.bidLoading = false;
      console.log(error.message);
    });
  }

  formatDate(date) {
    return moment(date).format('YYYY-MM-DD');
  }

  print(divName){
    
    var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "landscape" });
    let checkAS:boolean = false;
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
      if(value != null){
        val = value.toLocaleString('en-GB');
      }
      return val;
    }

    function createHeaders(keys) {
      let resultH = [];
      for (var i = 0; i < keys.length; i += 1) {
        resultH.push({
          id: keys[i],
          name: keys[i],
          prompt: keys[i],
          width: 50,
          align: "center",
          padding: 0
        });
      }
      return resultH;
    }
    
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
    doc.text("Trading Date: " + this.dateFormatted , 120, 15);
    doc.table(30, 20, result 
      ,headers
      , { autoSize: true
          , fontSize:8
          , headerBackgroundColor: "#e33f37"
          , headerTextColor:"white"
          , padding: 1
          });


    /*** Ramprate */
    var rrResult=[];
    

    rrResult.push({
      Id:stringValue(0),
      BreakPoint:'Break Point 1',
      MW:stringValue(this.offer.RampQuantity1),
      RU:stringValue(this.offer.RRU1),
      RD:stringValue(this.offer.RRD1)
    });

    rrResult.push({
      Id:stringValue(1),
      BreakPoint:'Break Point 2',
      MW:stringValue(this.offer.RampQuantity2),
      RU:stringValue(this.offer.RRU2),
      RD:stringValue(this.offer.RRD2)
    });

    rrResult.push({
      Id:stringValue(1),
      BreakPoint:'Break Point 3',
      MW:stringValue(this.offer.RampQuantity3),
      RU:stringValue(this.offer.RRU3),
      RD:stringValue(this.offer.RRD3)
    });
    
    let rrHeaders = [
      'BreakPoint',
      'MW',
      'RU',
      'RD'
    ]

    //doc.addPage("a4", "l");
    //doc.setFontSize(20);
    //doc.setFont("helvetica", "bold");
    //doc.text( "RAMP RATE" , 10, 10);

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
    doc.text("TransID: " + stringValue(this.transID) , 30, 190);
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

    let headerASRD = [
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
    
    doc.addPage();

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text( "RESERVED" , 30, 15);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text( "AS RU" , 30, 28);
    doc.table(30, 30, resultASRU 
      ,headerAS
      , { autoSize: true
        , fontSize:8
        , headerBackgroundColor: "#e33f37"
        , headerTextColor:"white"
        , padding: 1
        });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text( "AS RD" , 98, 28);
    doc.table(98, 30, resultASRD 
      ,headerASRD
      , { autoSize: true
        , fontSize:8
        , headerBackgroundColor: "#e33f37"
        , headerTextColor:"white"
        , padding: 1
        });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text( "AS FR" , 157, 28);
    doc.table(157, 30, resultASFR 
          ,headerASRD
          , { autoSize: true
            , fontSize:8
            , headerBackgroundColor: "#e33f37"
            , headerTextColor:"white"
            , padding: 1
            });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text( "AS DR" , 216, 28); 
    doc.table(216, 30, resultASDR 
          ,headerASRD
          , { autoSize: true
            , fontSize:8
            , headerBackgroundColor: "#e33f37"
            , headerTextColor:"white"
            , padding: 1
            });
    }
    
    doc.save(this.unitNumber + "_" + moment(this.dateFormatted).format('YYYYMMDD') + ".pdf");


  }

  ShowBidUpload(modal:NgbModal){
    this.dateToday = moment().format('YYYY-MM-DD');
    this.modalReference =this.modalService.open(modal,{centered:true});
  }
}
