import { Component, OnInit } from '@angular/core';
import { UnitsService } from './units.service';
import { HomeService } from '../home/home.service';
import { NgbModal, NgbModalRef, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.scss']
})
export class UnitsComponent implements OnInit {
  faPlus = faPlus;
  faEdit = faEdit;

  sites;
  units;
  currentSite = {
    name: '',
    id: ''
  };
  currentUserInfo;
  selectedUnit;
  selectedUnitWebSettings;
  colour:any;
  selectedFColor:any;
  bColor: any;
  fColor:any;
  fcolors;

  modalReference: NgbModalRef;

  operation;
  certificateURL;

  permissionID: number;
  successMessage = null;

  constructor(
    private router: Router,
    private userServices: UsersService,
    private unitServices: UnitsService,
    private homeService: HomeService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
  	this.getCurrentUserInfo();
  }

  getCurrentUserInfo() {
    this.userServices.getCurrentUserInfo().subscribe(info => {
      this.currentUserInfo = info;
      this.permissionID = this.currentUserInfo.PermissionID;

      this.homeService.getSiteList(+this.permissionID).subscribe(sites => {
        this.sites = sites;
      }, error => {
        console.log(error.message);
      });
  
    }, error => {
      console.log(error.message);
    });
  }

  selectedSite(id: number) {
    const selected = this.sites.find(site => site.SiteID === id);

    this.currentSite.id = selected.SiteID;
    this.currentSite.name = selected.SiteName;

    this.getUnitList();
  }

  openModal(content: NgbModal, unit) {
    this.modalReference = this.modalService.open(content, {size: 'lg'});

    this.selectedUnit = unit;

    this.unitServices.getWebSettings(+this.selectedUnit.UnitID).subscribe(data => {
      this.selectedUnitWebSettings = data;
    }, error => {
      console.log(error.message);
    });
  }

  createModal(content: NgbModal) {
    this.modalReference = this.modalService.open(content, {size: 'lg'});
    this.bColor = '#e40000';
    this.fColor = '#ffffff';
  }

  updateModal(content: NgbModal, unit) {
    this.modalReference = this.modalService.open(content, {size: 'lg'});
    this.selectedUnit = unit;
    this.bColor = unit['BColor'];
    this.fColor = unit['FColor'];
  }

  deleteModal(content: NgbModal, unit) {
    this.modalReference = this.modalService.open(content);
    this.selectedUnit = unit;
  }

  deleteUnit(untID) {
    this.unitServices.deleteUnit(+untID).subscribe(data => {
      if (this.currentSite.id !== '') {
        this.getUnitList();
      }
      this.successMessage = 'Successfully Deleted.';
      this.modalReference.close();
    }, error => {
      console.log(error.message);
    });
  }

  saveUnitConfiguration(operation, certificate, password, friendlyName, tpUser, bidType, sheetName, unit) {
    let certPath = null;

    if (certificate.files.length === 0 && this.selectedUnitWebSettings !== null) {
      certPath = this.selectedUnitWebSettings.FileLocation;
    } else if (certificate.files.length !== 0 && this.selectedUnitWebSettings !== null) {
      certPath = certificate.files[0].name;
    } else if (certificate.files.length !== 0 && this.selectedUnitWebSettings === null) {
      certPath = certificate.files[0].name;
    } else {
      certPath = null;
    }


    this.unitServices.postWebSettings(
      unit.UnitID,
      operation,
      certPath,
      password,
      friendlyName,
      tpUser,
      bidType,
      sheetName
    ).subscribe(data => {
      this.successMessage = 'Successfully saved.';
      this.modalReference.close();
    }, error => {
      console.log(error.message);
    });
  }

  checkValue(color){
    this.colour = color;
  }

  createUnit(id, unit, site, type) {
    
    this.unitServices.createUnit(+id, unit, site, type,this.bColor, this.fColor).subscribe(data => {
      if (this.currentSite.id !== '') {
        this.getUnitList();
      } 
      this.successMessage = 'Successfully saved.';
      this.modalReference.close();
    }, error => {
      console.log(error.message);
    });
  }

  getUnitList() {
    this.homeService.getUnitList(+this.currentSite.id).subscribe(data => {
      this.units = data;
    }, error => {
      console.log(error);
    });
  }
}
