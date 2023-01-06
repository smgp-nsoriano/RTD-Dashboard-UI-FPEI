import { TestBed } from '@angular/core/testing';

import { FtpServiceService } from './ftp-service.service';

describe('FtpServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FtpServiceService = TestBed.get(FtpServiceService);
    expect(service).toBeTruthy();
  });
});
