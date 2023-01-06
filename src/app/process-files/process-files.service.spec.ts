import { TestBed } from '@angular/core/testing';

import { ProcessFilesService } from './process-files.service';

describe('ProcessFilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcessFilesService = TestBed.get(ProcessFilesService);
    expect(service).toBeTruthy();
  });
});
