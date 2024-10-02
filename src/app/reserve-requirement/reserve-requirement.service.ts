import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ReserveRequirementService {

  constructor(private http: HttpClient,
    private env: EnvService) { }

  getDT(){
    return this.http.get(`${this.env.apiUrl}/Trading/CurrentDateTime`);
  }

  getRMRegionPrices24h(region, date) {
    let rr_date = moment(date).format("MM/DD/YYYY");
    
    // let dateNow = moment(new Date()).format("MM/DD/YYYY");
    // dateNow = "02/26/2024"
    
    return this.http.get(`${this.env.apiUrl}/reservemarket/GetRegionalPrices24h?Region=${region}&date=${rr_date}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }
}
