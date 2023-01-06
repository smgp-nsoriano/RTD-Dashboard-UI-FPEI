import { Component, OnInit ,OnDestroy,ViewChild} from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { interval, Subject } from 'rxjs';
import { UsersService } from '../users/users.service';
import { faClock, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

declare const require;

require('highcharts/modules/no-data-to-display')(Highcharts);
@Component({
  selector: 'app-pbreason',
  templateUrl: './pbreason.component.html',
  styleUrls: ['./pbreason.component.scss']
})
export class PBReasonComponent implements OnInit,OnDestroy {
  @ViewChild('alarmModal') alarmModal : any;

  private unsubscribe: Subject<any> = new Subject();
  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
  now = moment().format('MMMM DD, YYYY HH:mm:ss');
  timerClock: any;
  sites;
  currentSite = {
    name: '',
    id: ''
  };

  Highcharts = Highcharts;
  HADOptions=[];
  DAHOptions =[];
  updateFlag = true;

  constructor(
    private userService: UsersService,
    private modalService: NgbModal,
    config: NgbModalConfig) { 
    config.backdrop = 'static';
    config.keyboard = false;}

  ngOnInit() {
    this.bodyTag.classList.add('bg-dark');
    this.timerSetClock();
  }

  timerSetClock(){
    this.timerClock = setInterval(() => {
      this.now = moment().format('MMMM DD, YYYY HH:mm:ss');
    }, 1000);
  }
  
  ngOnDestroy() {
    this.bodyTag.classList.remove('bg-dark');
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
