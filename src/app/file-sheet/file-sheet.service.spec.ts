import { TestBed } from '@angular/core/testing';

import { FileSheetService } from './file-sheet.service';

describe('FileSheetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileSheetService = TestBed.get(FileSheetService);
    expect(service).toBeTruthy();
  });
});
