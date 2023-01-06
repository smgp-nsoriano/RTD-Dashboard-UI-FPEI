import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DapService } from './dap.service';

@Component({
  selector: 'app-dap',
  templateUrl: './dap.component.html',
  styleUrls: ['./dap.component.scss']
})
export class DapComponent implements OnInit {
  siteName;
  message = null;

  constructor(
    private route: ActivatedRoute,
    private dapService: DapService
  ) {
    this.route.queryParams.subscribe(param => this.siteName = param.siteName);
  }

  ngOnInit() {
    this.dapService.dapCsv(this.siteName).subscribe(data => {
      this.message = data;
    }, error => {
      this.message = error.message;
    });
  }

}
