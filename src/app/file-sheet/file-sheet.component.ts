import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FileSheetService} from './file-sheet.service';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'app-file-sheet',
  templateUrl: './file-sheet.component.html',
  styleUrls: ['./file-sheet.component.scss']
})
export class FileSheetComponent implements OnInit {
  fileId:any;
  fileName:any;
  faPlus = faPlus;
  successMessage=null;
  errorMessage=null;
  src:string;
  sheetList;
  modalReference: NgbModalRef;
  selectedFtp;
  modalTransact:string;
  isLoading=false;
  sheetName:string;
  functionName:string;

  constructor(
    private route: ActivatedRoute,
    private fileSheetService: FileSheetService,
    private modalService: NgbModal,
    config: NgbModalConfig
  ) { 
    this.route.params.subscribe(param => {
      this.fileId = param.fileId;
      this.fileName = param.fileName;
    });
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.getSheetList();
  }

  getSheetList(){
    this.fileSheetService.getSheetList(this.fileId).subscribe(data=>{
      this.sheetList = data;
    });
  } 

  openModal(content: NgbModal,ftp){
    this.modalReference = this.modalService.open(content);
    this.errorMessage=null;
    this.successMessage=null;
    this.isLoading=false;
    this.selectedFtp = ftp;
    if(ftp==null){
      this.modalTransact = 'Add New Sheet Name';
      this.sheetName = '';
      this.functionName = '';
    }else{
      this.modalTransact = 'Update Sheet Name';
      this.sheetName = ftp.SheetName;
      this.functionName = ftp.FunctionName;
    }

  }

  openDeleteModal(content: NgbModal,ftp){
    this.modalReference = this.modalService.open(content);
    this.selectedFtp = ftp;
    this.isLoading=false;
  }

  deleteFtp(){
    this.fileSheetService.deleteSheet(this.selectedFtp.ID).subscribe(data =>{
      let index = this.sheetList.findIndex(x => x.ID == this.selectedFtp.ID);
      this.sheetList[index] = {IsActive: false};

      this.successMessage = 'Record Successfully Deleted!';
      this.modalReference.close();
    });

  }

  saveFtp(){
    if(this.selectedFtp == null){
      this.fileSheetService.saveSheet({
        ID:0,
        SheetName:this.sheetName,
        FunctionName: this.functionName,
        IsActive:true,
        FTPFileID: this.fileId
      }).subscribe(data=>{
        this.sheetList.push(data);
        this.successMessage = 'Record Successfully Saved!';
        
        this.modalReference.close();
      }, error =>{
        this.successMessage = null;
        this.errorMessage = error.error.message;
        this.isLoading=false;
      });
    }else{
      this.fileSheetService.saveSheet({
        ID:this.selectedFtp.ID,
        SheetName:this.sheetName,
        FunctionName: this.functionName,
        IsActive:true,
        FTPFileID: this.fileId
      }).subscribe(data=>{
        let index = this.sheetList.findIndex(x => x.ID == this.selectedFtp.ID);
        this.sheetList[index] = data;
        this.successMessage = 'Record Successfully Saved!';
        
        this.modalReference.close();
      }, error =>{
        this.successMessage = null;
        this.errorMessage = error.error.message;
        this.isLoading=false;
      });
    }
  }
}
