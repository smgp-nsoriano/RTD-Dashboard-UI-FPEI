import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class BidsService {

  constructor(private http: HttpClient,
    private env: EnvService) { }

  getOffersValidation() {
    return this.http.get('assets/data/offers_validation.json');
  }
}
