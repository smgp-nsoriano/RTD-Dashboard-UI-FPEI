import { TestBed } from '@angular/core/testing';

import { FtpConfigService } from './ftp-config.service';

describe('FtpConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FtpConfigService = TestBed.get(FtpConfigService);
    expect(service).toBeTruthy();
  });
});
