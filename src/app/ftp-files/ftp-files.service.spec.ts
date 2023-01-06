import { TestBed } from '@angular/core/testing';

import { FtpFilesService } from './ftp-files.service';

describe('FtpFilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FtpFilesService = TestBed.get(FtpFilesService);
    expect(service).toBeTruthy();
  });
});
