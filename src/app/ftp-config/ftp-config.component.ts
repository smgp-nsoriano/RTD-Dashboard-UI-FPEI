import { Component, OnInit } from '@angular/core';
import {FtpConfigService} from './ftp-config.service';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-ftp-config',
  templateUrl: './ftp-config.component.html',
  styleUrls: ['./ftp-config.component.scss']
})
export class FtpConfigComponent implements OnInit {
  ftpList;
  selectedFtp;
  faPlus = faPlus;
  faEdit = faEdit;
  modalReference: NgbModalRef;
  modalTransact: string;
  successMessage=null;

  ipAddress:string;
  localPath:string;
  uflPath:string;
  username:string;
  password:string;
  src:string;

  constructor(
    private ftpConfigService: FtpConfigService,
    private modalService: NgbModal,
    config: NgbModalConfig
    ) { 
      config.backdrop = 'static';
      config.keyboard = false;
    }

  ngOnInit() {
    this.getFTPInfoList();
  }


  getFTPInfoList(){
    
    this.ftpConfigService.getFTPList().subscribe(data => {
      this.ftpList = data;
      //console.log(this.ftpList);
    });
  }

  openModal(content: NgbModal,ftp){
    this.modalReference = this.modalService.open(content, {size: 'lg'});
    this.selectedFtp = ftp;
    if(ftp != null){
      this.ipAddress = ftp.IPAddress;
      this.localPath = ftp.LocalRootPath;
      this.uflPath = ftp.UFLRootPath;
      this.username = ftp.Username;
      this.password = ftp.Password;
      this.modalTransact = 'Update FTP Configuration';
    }else{
      this.modalTransact = 'Add New FTP Configuration';
      this.ipAddress ='';
      this.localPath = '';
      this.uflPath = '';
      this.username = '';
      this.password = '';
    }
    //console.log(this.ftpList);
  }

  saveFtp(){
    if(this.selectedFtp == null){
      this.ftpConfigService.CreateUpdateFTP({
        IPAddress: this.ipAddress,
        LocalRootPath: this.localPath,
        UFLRootPath: this.uflPath,
        Username: this.username,
        Password: this.password,
        ID: 0,
        IsActive: true
      }).subscribe(data => {
        this.ftpList.push(data);
        //console.log(this.ftpList);
        this.successMessage = 'Record Successfully Saved!';
        this.modalReference.close();
      });
    }else{
      this.ftpConfigService.CreateUpdateFTP({
        IPAddress: this.ipAddress,
        LocalRootPath: this.localPath,
        UFLRootPath: this.uflPath,
        Username: this.username,
        Password: this.password,
        ID: this.selectedFtp.ID,
        IsActive: true
      }).subscribe(data => {
        let index = this.ftpList.findIndex(x => x.ID == this.selectedFtp.ID);
        this.ftpList[index] = data;

        //console.log(this.ftpList);
        this.successMessage = 'Record Successfully Saved!';
        this.modalReference.close();
      });
    }
    
  }

  openDeleteModal(modal,ftp){
    this.selectedFtp = ftp;
    this.modalReference = this.modalService.open(modal);
  }

  deleteFtp(){
    this.ftpConfigService.DeleteFTP(this.selectedFtp.ID).subscribe(data => {
      let index = this.ftpList.findIndex(x => x.ID == this.selectedFtp.ID);
      this.ftpList[index] = {IsActive: false};

      this.successMessage = 'Record Successfully Deleted!';
      this.modalReference.close();
    });

  }
}
