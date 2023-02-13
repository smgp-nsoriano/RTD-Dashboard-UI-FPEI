import { Component, OnInit, OnDestroy } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import { HomeService } from './home.service';
import * as moment from 'moment';
import { interval, Subject } from 'rxjs';
import { UsersService } from '../users/users.service';

declare const require;

require('highcharts/modules/no-data-to-display')(Highcharts);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsubscribe: Subject<any> = new Subject();
  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
  DAPHour:any;

  HADseriesOptions = [];
  DAHseriesOptions = [];
  updateFlag = true;
  isOperator: boolean;
  permissionID: any;
  errorMessage:any;
  operatorUnit;

  Highcharts = Highcharts;

  HADOptions = {
    title: '',
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Roboto Condensed'
      }
    },

    rangeSelector: {
      buttons: [
        {
          count: 30,
          type: 'minute',
          text: '30M'
        },
        {
          count: 1,
          type: 'hour',
          text: '1H'
        },
        {
          count: 1,
          type: 'day',
          text: '1D'
        }
      ],
      selected: 3,
      allButtonsEnabled: true,
      inputEnabled: false
    },

    yAxis: [{ // Primary yAxis
      labels: {
         format: '{value} MW',
         style: {
           color: '#618fbb',
         }
      },
      title: {
         text: '',
         style: {
           color: '#618fbb',
         }
      },
      
   },
    { // Price yAxis
     labels: {
        format: '{value} Php',
        style: {
         color: 'yellow',
        }
     },
     title: {
        text: '',
        style: {
         color: 'yellow',
        }
     },
     opposite: true
   }     ],

    xAxis: {
      type: 'category',
      gridLineWidth: 1,
      labels: {
        style: {
          color: '#fff'
        }
      },
    },

    plotOptions: {
      series: {
        compare: 'percent',
        showInNavigator: true,
        lineWidth: 4,
        marker: {
          enabled: false
        }
      }
    },

    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
      valueDecimals: 1,
      split: true
    },

    legend: {
      align: 'right',
      verticalAlign: 'top',
      itemStyle: {
        color: '#fff'
      },
      itemHoverStyle: {
        color: '#fff'
      }
    },

    series: [],
  };

  DAHOptions = {
    title: '',
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Roboto Condensed'
      }
    },

    xAxis: {
      type: 'category',
      gridLineWidth: 1,
      labels: {
        style: {
          color: '#fff'
        }
      },
    },
   yAxis : [
      { // Primary yAxis
         labels: {
            format: '{value} MW',
            style: {
              color: '#618fbb',
            }
         },
         title: {
            text: '',
            style: {
              color: '#618fbb',
            }
         },
         
      },
       { // Price yAxis
        labels: {
           format: '{value} Php',
           style: {
            color: 'yellow',
           }
        },
        title: {
           text: '',
           style: {
            color: 'yellow',
           }
        },
        opposite: true
      }     
   ],
   
   legend: {
     align: 'right',
     verticalAlign: 'top',
     itemStyle: {
       color: '#fff'
     },
     itemHoverStyle: {
       color: '#fff'
     }
   },

    plotOptions: {
      series: {
        compare: 'percent',
        showInNavigator: true,
        lineWidth: 4,
        marker: {
          enabled: false
        }
      }
    },

    tooltip: {
      pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
      valueDecimals: 1,
      split: true
    },
    series: [],
  };

  chartOptions = {         
    chart : {
       zoomType: 'xy',
       backgroundColor: 'transparent',
       style: {
         fontFamily: 'Roboto Condensed'
       }
    },
    
    title : {
       text: ''   
    },   
    
    xAxis : {
       categories: ['01', '02', '03', '04', '05', '06',
               '07', '08', '09', '10', '11', '12','13','14','15','16','17','18','19','20','21','22','23','24'],
       crosshair: true
    },
    yAxis : [
       { // Primary yAxis
          labels: {
             format: '{value}\xB0C',
             style: {
                color: Highcharts.getOptions().colors[2]
             }
          },
          title: {
             text: 'Price',
             style: {
                color: Highcharts.getOptions().colors[2]
             }
          },
          opposite: true
       }, 
       { // Secondary yAxis
          title: {
             text: 'RTD',
             style: {
                color: Highcharts.getOptions().colors[0]
             }
          },
          labels: {
             format: '{value} mm',
             style: {
                color: Highcharts.getOptions().colors[0]
             }
          }
       },
       { // Tertiary yAxis
          gridLineWidth: 0,
          title: {
             text: 'Actual',
             style: {
                color: Highcharts.getOptions().colors[3]
             }
          },
          labels: {
             format: '{value} mb',
             style: {
                color: Highcharts.getOptions().colors[3]
             }
          },
          opposite:true  
       }
    ],
    tooltip: {
       shared: true
    },
    legend: {
      align: 'right',
      verticalAlign: 'top',
      itemStyle: {
        color: '#fff'
      },
      itemHoverStyle: {
        color: '#fff'
      }
    },
    series : [
       {
          name: 'RTD',
          type: 'line',
          yAxis: 1,
          data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,
                  216.4, 194.1, 95.6, 54.4,49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5,
                  216.4, 194.1, 95.6, 54.4],
          tooltip: {
             valueSuffix: ' MW'
          }
       }, 
       {
          name: 'PRICE',
          type: 'line',
          yAxis: 2,
          data: [1016, 1016, 1015.9, 1015.5, 1012.3, 1009.5, 1009.6, 1010.2,
                   1013.1, 1016.9, 1018.2, 1016.7],
          tooltip: {
          valueSuffix: ' Php'
          }
       },
       {
          name: 'Actual',
          type: 'line',
          data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
          tooltip: {
             valueSuffix: ' MW'
          }
       }
    ]
 };

  currentDap = true;

  forecasts;
  pasts;
  current;

  sites;
  units;

  currentSite = {
    name: '',
    id: ''
  };

  currentUnit = {
    name: '',
    id: '',
    bColor:'',
    fColor:''
  };

  currentUserInfo;

  constructor(
    private homeService: HomeService,
    private userService: UsersService
  ) {
    
  }

  ngOnInit() {
    //this.isOperator = Boolean(JSON.parse(localStorage.getItem('isOperator')));
    //console.log(this.isOperator);
    
    this.bodyTag.classList.add('bg-dark');

    interval(1000).subscribe(() => {
      this.setData();
    });

    this.getData();

    interval(30000)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(() => {
      this.getData();
    });

    this.getCurrentUserInfo();
   
  }

  getData() {
    this.pasts = [];
    this.current = [];
    this.homeService.getCurrentRTD(+this.currentSite.id, +this.currentUnit.id).subscribe(data => {
      this.current = data;
    }, error => {
      console.log(error.message);
    });

    this.homeService.getErrorMessage(+this.currentSite.id, +this.currentUnit.id).subscribe(data => {
      if(data['message'] != null){
        this.errorMessage = 'There might be a problem in IEMOP NMMS Webservice. No downloaded data for ' + data['message'] ;
      }else{
        this.errorMessage = null;
      }
      
    }, error => {
      console.log(error.message);
    });


    this.homeService.getAheadRTD(+this.currentSite.id, +this.currentUnit.id).subscribe(data => {
      this.forecasts = data;
    }, error => {
      console.log(error.message);
    });

    this.homeService.getPastTime(+this.currentSite.id, +this.currentUnit.id).subscribe(data => {
      this.pasts = data;
    }, error => {
      console.log(error.message);
    });

    if (+this.currentSite.id !== 0 && +this.currentUnit.id !== 0) {
      this.homeService.getHAP(+this.currentSite.id, +this.currentUnit.id)
      .pipe(first())
      .subscribe(data => {
        const rtd = [];
        const price = [];
        const actual = [];

        Object.keys(data).forEach(element => {
          rtd.push([data[element].DateTIme, data[element].RTDValue]);
          actual.push([data[element].DateTIme, data[element].ActualValue]);

          if (this.currentUserInfo.IsShowPrice === true) {
            price.push([data[element].DateTIme, data[element].PriceValue]);
          } else {
            price.push([data[element].DateTIme, null]);
          }
        });

        this.HADseriesOptions = [];

        this.HADseriesOptions.push(
          {
            name: 'RTD',
            color: '#618fbb',
            data: rtd
          },
          {
            name: 'ACTUAL',
            color: 'red',
            data: actual
          },
          {
            name: 'PRICE',
            color: '#ffd40e',
            data: price,
            yAxis:1
          },
        );
      });

      this.homeService.getDAP(+this.currentSite.id, +this.currentUnit.id, this.currentDap)
      .subscribe(data => {
        const rtd = [];
        const actual = [];
        const price = [];
        this.DAPHour = data[1]['DAPHour'];
        
        Object.keys(data).forEach(element => {
          const hour = +element + 1;

          rtd.push([hour, data[element].RTDValue]);
          actual.push([hour, data[element].ActualValue]);

          if (this.currentUserInfo.IsShowPrice === true) {
            price.push([hour, data[element].PriceValue]);
          } else {
            price.push([hour, null]);
          }
        });

        this.DAHseriesOptions = [];

        this.DAHseriesOptions.push(
          {
            name: 'RTD',
            color: '#618fbb',
            data: rtd,
          },{
            name: 'ACTUAL',
            color: 'red',
            data: actual,
          }
          ,{
            name: 'PRICE',
            color: 'yellow',
            data: price,
            yAxis:1
          }
          
        );
      });
    }
  }

  setData() {
    this.HADOptions.series = this.HADseriesOptions;
    this.DAHOptions.series = this.DAHseriesOptions;
    this.chartOptions;
    this.updateFlag = true;
  }

  formatDate(date: string) {
    if (typeof date === 'undefined' || date === null) {
      return;
    }
    return moment(date).format('HH:mm');
  }

  currentTime(timestamp: string) {
    const minute = moment(timestamp).format('mm');
    const current = +moment().format('mm');
    const mod = +current % 5;
    const result = current - mod;

    if (result.toString().length === 1) {
      return moment().format('HH:0') + result;
    }

    return moment().format('HH:') + result;
  }

  selectedSite(id: number, operator: boolean) {
    
    if(!operator){
      const selected = this.sites.find(site => site.SiteID === id);

      this.currentSite.id = selected.SiteID;
      this.currentSite.name = selected.SiteName;
    }
    

    this.homeService.getUnitList(+this.currentSite.id).subscribe(data => {
      this.units = data;
    }, error => {
      console.log(error);
    });

    this.currentUnit.id = '';
    this.currentUnit.name = '';
    this.current = {};
    this.forecasts = [];
    this.pasts = [];
  }

  selectedUnit(id: number, operator: boolean, unit) {
    this.isOperator = operator;
    if(!operator){
      const selected = this.units.find(unit => unit.UnitID === id);

      this.currentUnit.id = selected.UnitID;
      this.currentUnit.name = selected.UnitNumber; 
      this.currentUnit.bColor = selected.BColor;
      this.currentUnit.fColor = selected.FColor;
    }else{
      this.currentUnit.id = unit.UnitID;
      this.currentUnit.name = unit.UnitNumber;
      this.currentUnit.bColor = unit.BColor;
      this.currentUnit.fColor = unit.FColor;
      this.currentSite.id = unit.SiteID;
      this.currentSite.name = unit.SiteCode;
    }

    this.homeService.getHAP(+this.currentSite.id, +this.currentUnit.id)
      .pipe(first())
      .subscribe(data => {
        this.getData();

        setTimeout(() => {
          //console.log(this.current, this.forecasts, this.pasts);
        }, 3000);

        const rtd = [];
        const price = [];
        const actual = [];

        Object.keys(data).forEach(element => {
          rtd.push([data[element].DateTIme, data[element].RTDValue]);
          actual.push([data[element].DateTIme, data[element].ActualValue]);

          if (this.currentUserInfo.IsShowPrice === true) {
            price.push([data[element].DateTIme, data[element].PriceValue]);
          } else {
            price.push([data[element].DateTIme, null]);
          }
        });

        this.HADseriesOptions = [];

        this.HADseriesOptions.push(
          {
            name: 'RTD',
            color: '#618fbb',
            data: rtd
          },
          {
            name: 'ACTUAL',
            color: 'red',
            data: actual
          },
          {
            name: 'PRICE',
            color: '#ffd40e',
            data: price,
            yAxis:1
          },
        );
      });

    this.setData();
  }

  getCurrentUserInfo() {
    this.userService.getCurrentUserInfo().subscribe(info => {
      this.currentUserInfo = info;
      
      this.permissionID = +this.currentUserInfo.PermissionID;
      

      if(this.currentUserInfo.IsOperator){
        this.homeService.getOperatorUnit(this.permissionID).subscribe(data=>{
          this.operatorUnit = data;
          this.currentUnit.name = this.operatorUnit.UnitNumber;
          this.currentUnit.id = this.operatorUnit.UnitID;
          this.currentUnit.bColor = this.operatorUnit.BColor;
          this.currentUnit.fColor = this.operatorUnit.FColor;
          this.currentSite.id = this.operatorUnit.SiteID;
          this.currentSite.name = this.operatorUnit.SiteCode;
          //this.selectedSite(+this.operatorUnit.SiteID, true);
          this.selectedUnit(+this.operatorUnit.UnitID, true, this.operatorUnit);
          //console.log(this.operatorUnit);
        });
      }else{
        this.homeService.getSiteList(this.permissionID).subscribe(data => {
          this.sites = data;
        }, error => {
          console.log(error.message);
        });
  
        this.homeService.getUnitList(+this.currentSite.id).subscribe(data => {
          this.units = data;
        }, error => {
          console.log(error.message);
        });
      }
      
    }, error => {
      console.log(error.message);
    });
  }

  filterDap(current: boolean) {
    this.currentDap = current;

    this.getData();
    this.setData();
  }

  ngOnDestroy() {
    this.bodyTag.classList.remove('bg-dark');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
