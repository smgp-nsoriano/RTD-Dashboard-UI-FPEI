import { TestBed } from '@angular/core/testing';

import { ReservePortfolioService } from './reserve-portfolio.service';

describe('ReservePortfolioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReservePortfolioService = TestBed.get(ReservePortfolioService);
    expect(service).toBeTruthy();
  });
});
