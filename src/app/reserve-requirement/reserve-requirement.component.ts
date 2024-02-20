import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

require('highcharts/modules/no-data-to-display')(Highcharts);

@Component({
  selector: 'app-reserve-requirement',
  templateUrl: './reserve-requirement.component.html',
  styleUrls: ['./reserve-requirement.component.scss']
})
export class ReserveRequirementComponent implements OnInit {

  Highcharts = Highcharts;
  DEMANDPOptions = {
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
  updateFlag = true;

  constructor() { }

  ngOnInit() {
  }

}
