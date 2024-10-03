import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env.service';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  constructor(
    private http: HttpClient,
    private env: EnvService
  ) { }

  getSites(id: number) {
    return this.http.get(`${this.env.apiUrl}/Configuration/GetSiteAccess?PermissionID=${+id}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  getWebSettings(unitId: number) {
    return this.http.get(`${this.env.apiUrl}/WebSetting/GetWebServiceSetting?UnitID=${unitId}`, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
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
    return this.http.post(`${this.env.apiUrl}/WebSetting/UpdateWebSetting`, data, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  uploadBids(data) {
    return this.http.post(`${this.env.apiUrl}/MarketData/GetBidFile`, data);
  }

  getOffer(unitId, unitNumber) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetBidOfferNew?UnitID=${unitId}&UnitNumber=${unitNumber}`);
  }

  getOfferByDate(unitNumber,date) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetBidOfferByDateNew?UnitNumber=${unitNumber}&DateSchedule=${date}`);
  }

  createBid(unitId, unitNumber, offers,controlMode) {
    const data = {unitId, unitNumber, offers,controlMode};
    return this.http.post(`${this.env.apiUrl}/MarketData/CreateBidNew`, data);
  }

  downloadBid(unitId, unitNumber, offers,controlMode) {
    const data = {unitId, unitNumber, offers, controlMode};    
    return this.http.post(`${this.env.apiUrl}/MarketData/BidXML`, data);
  }


  updateOffer(unitId, unitNumber, offers) {
    const data = {unitId, unitNumber, offers};
    return this.http.post(`${this.env.apiUrl}/MarketData/UpdateOffer`, data);
  }

  createOffer(unitNumber, date, previousDate,isWithOffer,isWithRampRate) {
    const data = {unitNumber, date, previousDate,isWithOffer,isWithRampRate};
    return this.http.post(`${this.env.apiUrl}/MarketData/CreateOfferNew`, data);
  }

  //Old Functions
  getOfferOriginal(unitId, unitNumber) {
    return this.http.get(`${this.env.apiUrl}/MarketData/GetBidOffer?UnitID=${unitId}&UnitNumber=${unitNumber}`);
  }

  createBidOriginal(unitId, unitNumber) {
    const data = {unitId, unitNumber};
    return this.http.post(`${this.env.apiUrl}/MarketData/CreateBid`, data);
  }

  uploadBidsOriginal(data) {
    return this.http.post(`${this.env.apiUrlV1}/Admin/GetFile`, data);
  }
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

    return this.http.post(`${this.env.apiUrl}/Configuration/CreateUpdateUnit`, data, {
      headers : {
        'Authorization' : 'Bearer ' + localStorage.getItem('userToken')
    }});
  }

  deleteUnit(unitID: number) {
    return this.http.delete(`${this.env.apiUrl}/Configuration/DeleteUnit/${unitID}`);
  }

  getRRStandard(unitNumber:string){
    return this.http.get(`${this.env.apiUrl}/MarketData/GetRRStandard?UnitNumber=${unitNumber}`);
  }

  setRRStandard(data){
    return this.http.post(`${this.env.apiUrl}/MarketData/SetRRStandard`, data);
  }
}
