import { TestBed } from '@angular/core/testing';

import { AccountTypesService } from './account-types.service';

describe('AccountTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountTypesService = TestBed.get(AccountTypesService);
    expect(service).toBeTruthy();
  });
});
