import { TestBed } from '@angular/core/testing';

import { DenominationsService } from './denominations.service';

describe('DenominationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DenominationsService = TestBed.get(DenominationsService);
    expect(service).toBeTruthy();
  });
});
