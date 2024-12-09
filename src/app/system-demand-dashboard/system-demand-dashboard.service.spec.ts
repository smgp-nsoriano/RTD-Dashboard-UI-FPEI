import { TestBed } from '@angular/core/testing';

import { SystemDemandDashboardServiceService } from './system-demand-dashboard.service';

describe('ReserveMarketDashboardServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SystemDemandDashboardServiceService = TestBed.get(SystemDemandDashboardServiceService);
    expect(service).toBeTruthy();
  });
});
