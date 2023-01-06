import { TestBed } from '@angular/core/testing';

import { PbreasonService } from './pbreason.service';

describe('PbreasonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PbreasonService = TestBed.get(PbreasonService);
    expect(service).toBeTruthy();
  });
});
