import { Component, OnInit } from '@angular/core';
import { WebListService } from './web-list.service';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-web-list',
  templateUrl: './web-list.component.html',
  styleUrls: ['./web-list.component.scss'],
})
export class WebListComponent implements OnInit {
  faEdit = faEdit;
  lists;
  selectedList;

  modalReference: NgbModalRef;

  successMessage = null;

  constructor(
    private modalService: NgbModal,
    private webListService: WebListService,
    config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.webListService.getList().subscribe(data => {
      this.lists = data;
    }, error => {
      console.log(error.message);
    });
  }

  openModal(content: NgbModal, list) {
    this.modalReference = this.modalService.open(content, {size: 'lg'});

    this.selectedList = list;
  }

  updateWebService(webId, url, type) {
    this.webListService.updateWebService(webId, url, type).subscribe(data => {
      this.getList();
      this.successMessage = 'Successfully saved.';
      this.modalReference.close();
    }, error => {
      console.log(error.message);
    });
  }
}
