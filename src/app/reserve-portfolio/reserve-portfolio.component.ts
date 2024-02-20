import { Component, OnInit } from '@angular/core';
import { ReservePortfolioService } from './reserve-portfolio.service';

@Component({
  selector: 'app-reserve-portfolio',
  templateUrl: './reserve-portfolio.component.html',
  styleUrls: ['./reserve-portfolio.component.scss']
})
export class ReservePortfolioComponent implements OnInit {

  constructor(private ReservePortfolioService: ReservePortfolioService) { }

  ngOnInit() {
    this.PopulateUnits();
  }

  PopulateUnits() {
    let permissionID = +localStorage.getItem('PermissionID');
    this.ReservePortfolioService.getUnitPerAccess(+permissionID).subscribe(data => {
      let bateries = Object.entries(data).map(entry => entry[1]).filter(e => e.TypeID === "BATT" && e.UnitNumber !== "01ANGAT_A");
      console.log(data);
    });
  }
}
