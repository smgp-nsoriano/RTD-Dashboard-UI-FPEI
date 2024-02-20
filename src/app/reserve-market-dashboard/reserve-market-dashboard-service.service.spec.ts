import { TestBed } from '@angular/core/testing';

import { ReserveMarketDashboardServiceService } from './reserve-market-dashboard-service.service';

describe('ReserveMarketDashboardServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReserveMarketDashboardServiceService = TestBed.get(ReserveMarketDashboardServiceService);
    expect(service).toBeTruthy();
  });
});
