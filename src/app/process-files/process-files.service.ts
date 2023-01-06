import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessFilesService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getLogs(dt) {
    return this.http.get(`${this.env.apiUrl}/MarketMap/GetLogs/${dt}`);
  }
}
