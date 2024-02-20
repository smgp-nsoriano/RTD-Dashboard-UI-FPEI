import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveMarketDashboardComponent } from './reserve-market-dashboard.component';

describe('ReserveMarketDashboardComponent', () => {
  let component: ReserveMarketDashboardComponent;
  let fixture: ComponentFixture<ReserveMarketDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReserveMarketDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveMarketDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
