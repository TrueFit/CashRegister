import { TestBed } from '@angular/core/testing';

import { CashRegisterService } from './cash-register.service';

describe('CashRegisterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CashRegisterService = TestBed.get(CashRegisterService);
    expect(service).toBeTruthy();
  });
});
