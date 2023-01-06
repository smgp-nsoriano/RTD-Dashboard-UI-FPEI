import { TestBed } from '@angular/core/testing';

import { TraderDashboardService } from './trader-dashboard.service';

describe('TraderDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TraderDashboardService = TestBed.get(TraderDashboardService);
    expect(service).toBeTruthy();
  });
});
