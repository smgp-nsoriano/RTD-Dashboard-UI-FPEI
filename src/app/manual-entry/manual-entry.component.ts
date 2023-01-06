import { Component, OnInit } from '@angular/core';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ManualEntryService } from './manual-entry.service';
import * as moment from 'moment';

@Component({
  selector: 'app-manual-entry',
  templateUrl: './manual-entry.component.html',
  styleUrls: ['./manual-entry.component.scss']
})
export class ManualEntryComponent implements OnInit {

  sites;
  units;
  currentDate: any;
  currentHour: number;
  currentMin: any;
  alert = {
    type: null,
    message: null
  };
message;
loading;

  constructor(
    private manualEntryService: ManualEntryService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.getSites();
    this.getCurrentDateAndTime();
    this.clearAlert();
    this.loading = false;
  }

  getSites() {
    return this.manualEntryService.getSites(localStorage.getItem('permissionID')).subscribe(data => {
      this.sites = data;
      // console.log(data);
    }, error => {
      console.log(error);
    });
  }

  LoadUnit(siteID: number) {
    this.clearAlert();
    this.getCurrentDateAndTime();
    return this.manualEntryService.getUnitList(+siteID).subscribe(data => {
      this.units = data;
      console.log(data);
    }, error => {
      console.log(error);
    });
  }

  getCurrentDateAndTime() {
    const current = +moment().format('mm');
    const mod = +current % 5;
    const addMin = (5 - +mod);
    this.currentDate = moment().add(+addMin , 'minutes').format('YYYY-MM-DD');
    this.currentHour = Number(moment().add(+addMin , 'minutes').format('HH'));
    this.currentMin = moment().add(+addMin , 'minutes').format('mm');
  }
saveValue() {
  if (this.units && this.units.length > 0 ) {
    this.loading = true;
    this.units.forEach(unit => {
      unit.TimeStamp = new Date(this.currentDate + ' ' + this.currentHour + ':' + this.currentMin + ':00');
    });
    console.log(this.units);
    this.manualEntryService.dataEntry(this.units).subscribe(data => {
      this.message = data;
      if (this.message.status === 'success') {
        this.alert.type = this.message.status;
      } else {
        this.alert.type = 'danger';
      }
      this.alert.message = this.message.message;
      this.loading = false;
    }, error => {
      console.error(error);
      this.alert.type = 'danger';
      this.alert.message = error;
      this.loading = false;
    } );
  }
}

clearAlert() {
  this.alert.type = null;
  this.alert.message = null;
}
}
