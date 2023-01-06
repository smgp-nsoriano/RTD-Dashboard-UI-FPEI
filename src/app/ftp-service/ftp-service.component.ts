import { Component, OnInit } from '@angular/core';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {FtpServiceService} from './ftp-service.service';

@Component({
  selector: 'app-ftp-service',
  templateUrl: './ftp-service.component.html',
  styleUrls: ['./ftp-service.component.scss']
})
export class FtpServiceComponent implements OnInit {
  successMessage=null;
  errorMessage=null;
  src:string;
  modalReference: NgbModalRef;
  selectedService;
  serviceName:string;
  interval=0;
  ftpServices;
  modalTransact:string;
  faPlus = faPlus;
  faEdit = faEdit;
  isLoading=false;

  constructor(
    private ftpServiceService: FtpServiceService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.getFtpServices();
  }

  openModal(content: NgbModal,ftp){
    this.modalReference = this.modalService.open(content);
    this.errorMessage=null;
    this.successMessage=null;
    this.isLoading=false;
    this.selectedService = ftp;
    if(ftp != null){
      this.serviceName = ftp.ServiceName;
      this.interval = ftp.Interval;
      this.modalTransact = 'Update Service';
    }else{
      this.modalTransact = 'Add New Service';
      this.serviceName = '';
      this.interval = 0;
    }
  }

  getFtpServices()
  {
    this.ftpServiceService.getServiceList().subscribe(data =>{
      this.ftpServices = data;
    });
  }

  saveFtp(){
    this.isLoading=true;
    if(this.selectedService == null){
      this.ftpServiceService.CreateUpdateService({
        ServiceName:this.serviceName,
        Interval:this.interval,
        ID:0,
        IsActive: true
      }).subscribe(data=>{
        this.ftpServices.push(data);
        this.successMessage = 'Record Successfully Saved!';
        this.modalReference.close();
        this.isLoading=false;
        this.errorMessage = null;
      },error => {
        this.successMessage = null;
        this.errorMessage = error.error.message;
        this.isLoading=false;
      });
    }else{
      this.ftpServiceService.CreateUpdateService({
        ServiceName:this.serviceName,
        Interval:this.interval,
        ID:this.selectedService.ID,
        IsActive: true
      }).subscribe(data=>{
        let index = this.ftpServices.findIndex(x => x.ID == this.selectedService.ID);
        this.ftpServices[index] = data;

        this.successMessage = 'Record Successfully Saved!';
        this.errorMessage = null;
        this.modalReference.close();
        this.isLoading=false;
      },error => {
        this.successMessage = null;
        this.errorMessage = error.error.message;
        this.isLoading=false;
      });
    }
  }

  openDeleteModal(modal,ftp){
    this.selectedService = ftp;
    this.modalReference = this.modalService.open(modal);
    this.isLoading=false;
  }


  deleteFtp(){
    this.ftpServiceService.DeleteService(this.selectedService.ID).subscribe(data => {
      let index = this.ftpServices.findIndex(x => x.ID == this.selectedService.ID);
      this.ftpServices[index] = {IsActive: false};

      this.successMessage = 'Record Successfully Deleted!';
      this.modalReference.close();
    });

  }
}
