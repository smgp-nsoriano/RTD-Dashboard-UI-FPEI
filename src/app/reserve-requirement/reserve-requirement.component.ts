import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ReserveRequirementService } from './reserve-requirement.service';
import * as moment from 'moment';
import { EventService } from '../trader-dashboard/EventService';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

require('highcharts/modules/no-data-to-display')(Highcharts);

@Component({
  selector: 'app-reserve-requirement',
  templateUrl: './reserve-requirement.component.html',
  styleUrls: ['./reserve-requirement.component.scss']
})
export class ReserveRequirementComponent implements OnInit,OnDestroy,AfterViewInit {
  private destroy$ = new Subject<void>();
  now
  timerData
  timerDT
  timerClock

  alertMessage:string;
   alarmOutsideLimit:boolean;
  alarmNoconnection:boolean;
  alarmRTDChanged:boolean;
  alarmHAP:boolean;
  alarmOverride:boolean;
  timerAlarmOutsideLimit:any;
  timerAlarmReserveChanged:any;
  timerAlarmNoConnection:any;
  timerAlarmHAP:any;
 
  regions = ['CLUZ', 'CVIS', 'CMIN']
  Highcharts = Highcharts;
  optionsTemplate = {
    title: '',
    chart: {
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Roboto Condensed'
      }
    },

    xAxis: {
      type: 'category',
      gridLineWidth: 0.5,
      labels: {
        useHTML: true,
        style: {
          color: '#fff'
        },
        formatter: function() {
          const currentHour = new Date().getHours()
          if (this.value === currentHour.toString()) return `<span style="color: red">${this.value}</span>`
          return this.value
        }
      },
    },
    yAxis : [
      { // Primary yAxis
         labels: {
            format: '{value} MW',
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
    series: [
      {
        type: 'area',
        name: "REQT",
        color: '#43A6C6',
        data: [1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4]
      },
      {
        name: "SCHED",
        color: 'orange',
        data: [2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1]
      },
      {
        name: "PRICE",
        color: 'yellow',
        yAxis: 1,
        data: [3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2]
      },
    ],
  };
  dottedTrendSnippet = {
    zoneAxis: 'x',
    zones: [{
      value: new Date().getHours().toString()
    }, {
      dashStyle: 'dot'
    }]
  }
  updateFlags = [false, false, false, false, false, false, false, false, false];

  ru_luz_options = {
    title: '',
    chart: this.optionsTemplate.chart,
    xAxis: this.optionsTemplate.xAxis,
    yAxis : this.optionsTemplate.yAxis,
    legend: this.optionsTemplate.legend,
    plotOptions: this.optionsTemplate.plotOptions,
    tooltip: this.optionsTemplate.tooltip,
    series: [],
  };
  rd_luz_options = {
    title: '',
    chart: this.optionsTemplate.chart,
    xAxis: this.optionsTemplate.xAxis,
    yAxis : this.optionsTemplate.yAxis,
    legend: this.optionsTemplate.legend,
    plotOptions: this.optionsTemplate.plotOptions,
    tooltip: this.optionsTemplate.tooltip,
    series: [],
  };
  cr_luz_options = {
    title: '',
    chart: this.optionsTemplate.chart,
    xAxis: this.optionsTemplate.xAxis,
    yAxis : this.optionsTemplate.yAxis,
    legend: this.optionsTemplate.legend,
    plotOptions: this.optionsTemplate.plotOptions,
    tooltip: this.optionsTemplate.tooltip,
    series: [],
  };
  ru_vis_options = {
    title: '',
    chart: this.optionsTemplate.chart,
    xAxis: this.optionsTemplate.xAxis,
    yAxis : this.optionsTemplate.yAxis,
    legend: this.optionsTemplate.legend,
    plotOptions: this.optionsTemplate.plotOptions,
    tooltip: this.optionsTemplate.tooltip,
    series: [],
  };
  rd_vis_options = {
    title: '',
    chart: this.optionsTemplate.chart,
    xAxis: this.optionsTemplate.xAxis,
    yAxis : this.optionsTemplate.yAxis,
    legend: this.optionsTemplate.legend,
    plotOptions: this.optionsTemplate.plotOptions,
    tooltip: this.optionsTemplate.tooltip,
    series: [],
  };
  cr_vis_options = {
    title: '',
    chart: this.optionsTemplate.chart,
    xAxis: this.optionsTemplate.xAxis,
    yAxis : this.optionsTemplate.yAxis,
    legend: this.optionsTemplate.legend,
    plotOptions: this.optionsTemplate.plotOptions,
    tooltip: this.optionsTemplate.tooltip,
    series: [],
  };
  ru_min_options = {
    title: '',
    chart: this.optionsTemplate.chart,
    xAxis: this.optionsTemplate.xAxis,
    yAxis : this.optionsTemplate.yAxis,
    legend: this.optionsTemplate.legend,
    plotOptions: this.optionsTemplate.plotOptions,
    tooltip: this.optionsTemplate.tooltip,
    series: [],
  };
  rd_min_options = {
    title: '',
    chart: this.optionsTemplate.chart,
    xAxis: this.optionsTemplate.xAxis,
    yAxis : this.optionsTemplate.yAxis,
    legend: this.optionsTemplate.legend,
    plotOptions: this.optionsTemplate.plotOptions,
    tooltip: this.optionsTemplate.tooltip,
    series: [],
  };
  cr_min_options = {
    title: '',
    chart: this.optionsTemplate.chart,
    xAxis: this.optionsTemplate.xAxis,
    yAxis : this.optionsTemplate.yAxis,
    legend: this.optionsTemplate.legend,
    plotOptions: this.optionsTemplate.plotOptions,
    tooltip: this.optionsTemplate.tooltip,
    series: [],
  };


  constructor(private eventService:EventService, private ReserveRequirementService: ReserveRequirementService) { }

  ngOnInit() {
    this.alarmRTDChanged=false;
    this.alarmOutsideLimit=false;
    this.now = moment("","MM/DD/YYYY HH:mm:ss");
    this.SetTimeFromServer();
    this.timerDT = setInterval(() => {
      this.SetTimeFromServer();
    }, 30000);

    this.GetDataPerRegion();
    
  }

  ngAfterViewInit(){
  this.eventService.getClickEvent()
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.ManualRefresh();
    });
  }

  GetDataPerRegion() {
    
    this.ReserveRequirementService.getRMRegionPrices24h("CLUZ").subscribe(data => {
      // console.log(data);
      let resData = Object.entries(data).map(entry => entry[1])

      let ru_reqt = resData[0]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.MrktReqt])
      let ru_sched = resData[0]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Schedule])
      let ru_price = resData[0]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Price])
      this.pushDataToChart("ru_luz_options", ru_reqt, ru_sched, ru_price)
      this.updateFlags[0] = true

      let rd_reqt = resData[1]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.MrktReqt])
      let rd_sched = resData[1]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Schedule])
      let rd_price = resData[1]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Price])
      this.pushDataToChart("rd_luz_options", rd_reqt, rd_sched, rd_price)
      this.updateFlags[1] = true

      let cr_reqt = resData[2]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.MrktReqt])
      let cr_sched = resData[2]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Schedule])
      let cr_price = resData[2]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Price])
      this.pushDataToChart("cr_luz_options", cr_reqt, cr_sched, cr_price)
      this.updateFlags[2] = true
    });
    this.ReserveRequirementService.getRMRegionPrices24h("CVIS").subscribe(data => {
      let resData = Object.entries(data).map(entry => entry[1])

      let ru_reqt = resData[0]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.MrktReqt])
      let ru_sched = resData[0]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Schedule])
      let ru_price = resData[0]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Price])
      this.pushDataToChart("ru_vis_options", ru_reqt, ru_sched, ru_price)
      this.updateFlags[3] = true

      let rd_reqt = resData[1]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.MrktReqt])
      let rd_sched = resData[1]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Schedule])
      let rd_price = resData[1]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Price])
      this.pushDataToChart("rd_vis_options", rd_reqt, rd_sched, rd_price)
      this.updateFlags[4] = true

      let cr_reqt = resData[2]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.MrktReqt])
      let cr_sched = resData[2]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Schedule])
      let cr_price = resData[2]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Price])
      this.pushDataToChart("cr_vis_options", cr_reqt, cr_sched, cr_price)
      this.updateFlags[5] = true
    });
    this.ReserveRequirementService.getRMRegionPrices24h("CMIN").subscribe(data => {
      let resData = Object.entries(data).map(entry => entry[1])

      let ru_reqt = resData[0]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.MrktReqt])
      let ru_sched = resData[0]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Schedule])
      let ru_price = resData[0]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Price])
      this.pushDataToChart("ru_min_options", ru_reqt, ru_sched, ru_price)
      this.updateFlags[6] = true

      let rd_reqt = resData[1]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.MrktReqt])
      let rd_sched = resData[1]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Schedule])
      let rd_price = resData[1]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Price])
      this.pushDataToChart("rd_min_options", rd_reqt, rd_sched, rd_price)
      this.updateFlags[7] = true

      let cr_reqt = resData[2]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.MrktReqt])
      let cr_sched = resData[2]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Schedule])
      let cr_price = resData[2]['ReserveRegionalSchedules'].map(obj => [parseInt(obj.Interval.split(":")[0]).toString(), obj.Price])
      this.pushDataToChart("cr_min_options", cr_reqt, cr_sched, cr_price)
      this.updateFlags[8] = true
    });
  }

  pushDataToChart(chartOptions_name:string, reqt, sched, price) {
    this[chartOptions_name].series = [
        {
          type: 'area',
          name: "REQT",
          color: '#43A6C6',
          data: [...reqt],
          // ...this.dottedTrendSnippets
        },
        {
          name: "SCHED",
          color: 'orange',
          data: [...sched],
          // ...this.dottedTrendSnippet
        },
        {
          name: "PRICE",
          color: 'yellow',
          yAxis: 1,
          data: [...price],
          // ...this.dottedTrendSnippet
        },
      ];
  }

  SetTimeFromServer(){
    this.ReserveRequirementService.getDT().subscribe(data=>{
      clearInterval(this.timerData);
      clearInterval(this.timerClock);
      this.TimerSetClock(data.toString());
      this.TimerGetData();
    });
  }

  TimerSetClock(dt:string){
    //
    this.now = moment(dt,"MM/DD/YYYY HH:mm:ss");
    this.timerClock = setInterval(() => {
      this.now.add(1, 'second');
      // this.HADOptions.series = this.HADseriesOptions;
      // this.DAPAllUnitOptions.series = this.DAPAllUnitseriesOptions;
      // this.updateFlag = true;
    }, 1000);
  }

  TimerGetData(){
    this.timerData = setInterval(() => {
      if (+moment(this.now).second() == 3) {
        console.log("fetch");
        
        this.GetDataPerRegion();
      }
    }, 15000);
  }

  ManualRefresh(){
    console.log("Reserve Requirement Refresh Triggered");
    this.GetDataPerRegion();
  }
  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
