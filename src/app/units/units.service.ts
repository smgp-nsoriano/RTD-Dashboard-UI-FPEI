import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {
  fetch_userToken(){
    return {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
      }
    }
  }

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getSites(id: number) {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetSiteAccess?PermissionID=${+id}`, this.fetch_userToken());
  }

  getWebSettings(unitId: number) {
    return this.http.get(`${this.env.apiUrl}/WebSetting/GetWebServiceSetting?UnitID=${unitId}`, this.fetch_userToken());
  }

  postWebSettings(
    UnitID: number,
    Operation: string,
    CertificateURL: string,
    Password: string,
    FriendlyName: string,
    TpUser: string,
    BidType: string,
    SheetName: string,
    IsActive: boolean = true
  ) {
    const data = {
      UnitID,
      Operation,
      CertificateURL,
      Password,
      FriendlyName,
      TpUser,
      BidType,
      SheetName,
      IsActive
    };
    return this.http.post(`${this.env.apiUrl}/WebSetting/UpdateWebSetting`, data, this.fetch_userToken());
  }

  uploadBids(data) {
    return this.http.post(`${this.env.apiUrl}/MarketData/GetBidFile`, data, this.fetch_userToken());
  }

  getOffer(unitId, unitNumber) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetBidOfferNew?UnitID=${unitId}&UnitNumber=${unitNumber}`, this.fetch_userToken());
  }

  getOfferByDate(unitNumber,date) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetBidOfferByDateNew?UnitNumber=${unitNumber}&DateSchedule=${date}`, this.fetch_userToken());
  }

  createBid(unitId, unitNumber, offers,controlMode) {
    const data = {unitId, unitNumber, offers,controlMode};
    return this.http.post(`${this.env.apiUrl}/MarketData/CreateBidNew`, data, this.fetch_userToken());
  }

  logBid(unitId, unitNumber, offers,controlMode) {
    const data = {unitId, unitNumber, offers,controlMode};
    return this.http.post(`${this.env.apiUrl}/MarketData/LogBid`, data, this.fetch_userToken());
  }

  downloadBid(unitId, unitNumber, offers,controlMode) {
    const data = {unitId, unitNumber, offers, controlMode};    
    return this.http.post(`${this.env.apiUrl}/MarketData/BidXML`, data, this.fetch_userToken());
  }


  updateOffer(unitId, unitNumber, offers) {
    const data = {unitId, unitNumber, offers};
    return this.http.post(`${this.env.apiUrl}/MarketData/UpdateOffer`, data, this.fetch_userToken());
  }

  createOffer(unitNumber, date, previousDate,isWithOffer,isWithRampRate) {
    const data = {unitNumber, date, previousDate,isWithOffer,isWithRampRate};
    return this.http.post(`${this.env.apiUrl}/MarketData/CreateOfferNew`, data, this.fetch_userToken());
  }

  //Old Functions
  getOfferOriginal(unitId, unitNumber) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetBidOffer?UnitID=${unitId}&UnitNumber=${unitNumber}`, this.fetch_userToken());
  }

  createBidOriginal(unitId, unitNumber) {
    const data = {unitId, unitNumber};
    return this.http.post(`${this.env.apiUrl}/MarketData/CreateBid`, data, this.fetch_userToken());
  }

  // uploadBidsOriginal(data) {
  //   return this.http.post(`${this.env.apiUrlV1}/Admin/GetFile`, data);
  // }
  //Old Functions

  createUnit(UnitID: number, UnitNumber: string, SiteID: string, TypeID: string, BColor: string, FColor: string) {
    const data = {
      UnitID,
      UnitNumber,
      SiteID,
      TypeID,
      BColor,
      FColor
    };

    return this.http.post(`${this.env.apiUrl}/Configuration/CreateUpdateUnit`, data, this.fetch_userToken());
  }

  deleteUnit(unitID: number) {
    return this.http.delete(`${this.env.apiUrl}/Configuration/DeleteUnit/${unitID}`, this.fetch_userToken());
  }

  getRRStandard(unitNumber:string){
    return this.http.get(`${this.env.apiUrl}/MarketData/GetRRStandard?UnitNumber=${unitNumber}`, this.fetch_userToken());
  }

  setRRStandard(data){
    return this.http.post(`${this.env.apiUrl}/MarketData/SetRRStandard`, data, this.fetch_userToken());
  }
}
