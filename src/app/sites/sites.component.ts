import { Component, OnInit } from '@angular/core';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SitesService } from './sites.service';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrls: ['./sites.component.scss']
})
export class SitesComponent implements OnInit {
  faPlus = faPlus;
  faEdit = faEdit;
  isDeleting: boolean;
  sites;
  selectedSite;

  modalReference: NgbModalRef;

  successMessage = null;

  constructor(
    private siteService: SitesService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.getSites();
  }

  openModal(content: NgbModal) {
    this.modalReference = this.modalService.open(content, {size: 'lg'});
  }

  updateModal(content: NgbModal, site) {
  this.modalReference = this.modalService.open(content, {size: 'lg'});
  this.selectedSite = site;
  }

  getSites() {
    return this.siteService.getSites(1).subscribe(data => {
      this.sites = data;
    }, error => {
      console.log(error);
    });
  }

  createSite(siteId, name, code, address, region, path) {
    this.siteService.createOrUpdateSite(+siteId, name, code, address, region, path).subscribe(data => {
      this.getSites();
      this.successMessage = 'Successfully saved.';
      this.modalReference.close();
    }, error => {
      console.log(error.message);
    });
  }
  DeleteModal(modal, site) {
    this.modalReference = this.modalService.open(modal);
    this.selectedSite = site;
  }

  deleteSite(siteID) {
    this.siteService.deleteSite(+siteID).subscribe(data => {
      this.getSites();
      this.successMessage = 'Successfully Deleted.';
      this.modalReference.close();
    }, error => {
      console.log(error.message);
    });
  }
}
