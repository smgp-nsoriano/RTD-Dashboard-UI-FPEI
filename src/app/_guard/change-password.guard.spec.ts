import { TestBed, async, inject } from '@angular/core/testing';

import { ChangePasswordGuard } from './change-password.guard';

describe('ChangePasswordGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChangePasswordGuard]
    });
  });

  it('should ...', inject([ChangePasswordGuard], (guard: ChangePasswordGuard) => {
    expect(guard).toBeTruthy();
  }));
});
