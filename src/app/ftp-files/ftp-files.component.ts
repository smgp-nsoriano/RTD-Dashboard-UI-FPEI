import { Component, OnInit } from '@angular/core';
import {FtpFilesService} from './ftp-files.service';
import { faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ftp-files',
  templateUrl: './ftp-files.component.html',
  styleUrls: ['./ftp-files.component.scss']
})
export class FtpFilesComponent implements OnInit {
  modalReference: NgbModalRef;
  selectedFtp;
  modalTransact:string;
  ftpFiles;
  src:string;
  successMessage=null;
  faPlus = faPlus;
  ftpConfig;
  selectedftpConfig:any;
  ftpServices;
  selectedUFLFolder:string;
  fileNamePre:string;
  fileFormat: string;
  fileNameSuf:string;
  fileExtension:string;
  filePerDay:string;
  selectedService=0;
  filePath:string;
  errorMessage=null;
  isLoading = false;

  constructor(
    private ftpFilesService: FtpFilesService,
    private modalService: NgbModal,
    config: NgbModalConfig
    ) { 
      config.backdrop = 'static';
      config.keyboard = false;
    }

  ngOnInit() {
    this.getFTPFiles();
  }
  
  getFTPFiles(){
    this.ftpFilesService.getFTPFiles().subscribe(data =>{
      this.ftpFiles = data;
    });
  }

  saveFtp(){
    this.isLoading = true;
    if(this.selectedFtp == null){
      this.ftpFilesService.SaveFiles({
        ID:0,
        FTPConfigID: this.selectedftpConfig,
        FilePath: this.filePath,
        UploadFilePath: '/ProcessedFile',
        FilePrefix: this.fileNamePre,
        FileFormat: this.fileFormat,
        FileSuffix: this.fileNameSuf,
        ExtensionName: this.fileExtension,
        FileperDay: this.filePerDay,
        UFLPath: this.selectedUFLFolder,
        DownloadPath: '',
        IsActive: true,
        FTPFile: '',
        ServiceSetupID: 0,
        ServiceID: this.selectedService,
        ServiceName: ''
      }).subscribe(data=>{
        this.ftpFiles.push(data);
        this.successMessage = 'Record Successfully Saved!';
        this.modalReference.close();
        this.isLoading = false;
      }, error => {
        this.successMessage = null;
        this.errorMessage = error.error.message;
        this.isLoading=false;
      });
    }else{
      this.ftpFilesService.SaveFiles({
        ID:this.selectedFtp.ID,
        FTPConfigID: this.selectedftpConfig,
        FilePath: this.filePath,
        UploadFilePath: '/ProcessedFile',
        FilePrefix: this.fileNamePre,
        FileFormat: this.fileFormat,
        FileSuffix: this.fileNameSuf,
        ExtensionName: this.fileExtension,
        FileperDay: this.filePerDay,
        UFLPath: this.selectedUFLFolder,
        DownloadPath: this.selectedFtp.DownloadPath,
        IsActive: true,
        FTPFile: this.selectedFtp.FTPFile,
        ServiceSetupID: this.selectedFtp.ServiceSetupID,
        ServiceID: this.selectedService,
        ServiceName: this.selectedFtp.ServiceName
      }).subscribe(data=>{
        let index = this.ftpFiles.findIndex(x => x.ID == this.selectedFtp.ID);
        this.ftpFiles[index] = data;

        
        this.successMessage = 'Record Successfully Saved!';
        this.modalReference.close();
        this.isLoading = false;
      }, error => {
        this.successMessage = null;
        this.errorMessage = error.error.message;
        this.isLoading=false;
      });
    }
  }

  openModal(content: NgbModal,ftp){
    this.modalReference = this.modalService.open(content, {size: 'lg'});
    this.selectedFtp = ftp;
    this.getFTPList();
    this.getFTPServices();
    this.errorMessage = null;
    this.successMessage = null;
    if(ftp == null){
      this.selectedftpConfig = 0;
      this.selectedService = 0;
      this.selectedUFLFolder = '--Select UFL Folder--';
      this.fileNamePre = '';
      this.fileFormat = '';
      this.fileNameSuf = '';
      this.fileExtension = '';
      this.filePerDay = '';
      this.filePath = '';
      this.modalTransact = 'Add New FTP File';
    }else{
      this.modalTransact = 'Update FTP File';
      this.selectedftpConfig = ftp.FTPConfigID;
      this.selectedService = ftp.ServiceID;
      this.selectedUFLFolder = ftp.UFLPath;
      this.fileNamePre = ftp.FilePrefix;
      this.fileFormat = ftp.FileFormat;
      this.fileNameSuf = ftp.FileSuffix;
      this.fileExtension = ftp.ExtensionName;
      this.filePerDay = ftp.FileperDay;
      this.filePath = ftp.FilePath;
    }
   
  }

  openDeleteModal(modal,ftp){
    this.selectedFtp = ftp;
    this.modalReference = this.modalService.open(modal);
  }

  deleteFtp(){
    this.ftpFilesService.DeleteFile(this.selectedFtp.ID).subscribe(data => {
      let index = this.ftpFiles.findIndex(x => x.ID == this.selectedFtp.ID);
      this.ftpFiles[index] = {IsActive: false};

      this.successMessage = 'Record Successfully Deleted!';
      this.modalReference.close();
    });

  }

  getFTPList(){
    this.ftpFilesService.getFTPList().subscribe(data=>{
      this.ftpConfig = data;
    });
  }

  getFTPServices(){
    this.ftpFilesService.getServiceList().subscribe(data=>{
      this.ftpServices = data;
    });
  }
}
