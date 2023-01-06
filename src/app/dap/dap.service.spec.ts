import { TestBed } from '@angular/core/testing';

import { DapService } from './dap.service';

describe('DapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DapService = TestBed.get(DapService);
    expect(service).toBeTruthy();
  });
});
