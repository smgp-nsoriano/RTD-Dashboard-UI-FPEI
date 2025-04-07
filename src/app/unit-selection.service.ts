import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnitSelectionService {
  private currentUnitPriceSource = new BehaviorSubject<any>(this.getUnitPriceFromSession());
  currentUnitPrice$ = this.currentUnitPriceSource.asObservable();

  constructor() {}
  private getUnitPriceFromSession() {
    const unitPrice = sessionStorage.getItem('unitPrice');
    return unitPrice ? JSON.parse(unitPrice) : null;
  }

  setCurrentUnitPrice(unitPrice: any) {
    sessionStorage.setItem('unitPrice', JSON.stringify(unitPrice));
    this.currentUnitPriceSource.next(unitPrice);
  }

  getCurrentUnitPrice() {
    return this.currentUnitPriceSource.getValue();
  }
}
