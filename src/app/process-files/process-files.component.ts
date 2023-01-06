import { Component, OnInit } from '@angular/core';
import { ProcessFilesService } from './process-files.service';

@Component({
  selector: 'app-process-files',
  templateUrl: './process-files.component.html',
  styleUrls: ['./process-files.component.scss']
})
export class ProcessFilesComponent implements OnInit {
  dt:any;
  logs;
  src:string;
  isLoading=false;

  constructor(
    private processFilesService: ProcessFilesService
  ) { }

  ngOnInit() {
  }

  getLogs(){
    this.isLoading = true;
    this.processFilesService.getLogs(this.dt).subscribe(data=>{
      this.logs = data;
      console.log(this.logs);
      console.log(this.dt);
      this.isLoading = false;
    });
  } 

}
