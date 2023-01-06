import { TestBed } from '@angular/core/testing';

import { WebListService } from './web-list.service';

describe('WebListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WebListService = TestBed.get(WebListService);
    expect(service).toBeTruthy();
  });
});
