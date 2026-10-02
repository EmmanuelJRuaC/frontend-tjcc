import { TestBed } from '@angular/core/testing';

import { ApiTallerCostos } from './api-taller-costos';

describe('ApiTallerCostos', () => {
  let service: ApiTallerCostos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiTallerCostos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
