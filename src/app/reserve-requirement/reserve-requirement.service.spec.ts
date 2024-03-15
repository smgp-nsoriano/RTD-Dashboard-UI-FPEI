import { TestBed } from '@angular/core/testing';

import { ReserveRequirementService } from './reserve-requirement.service';

describe('ReserveRequirementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReserveRequirementService = TestBed.get(ReserveRequirementService);
    expect(service).toBeTruthy();
  });
});
