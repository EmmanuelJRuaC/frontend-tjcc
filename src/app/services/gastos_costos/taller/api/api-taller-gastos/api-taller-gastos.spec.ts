import { TestBed } from '@angular/core/testing';

import { ApiTallerGastos } from './api-taller-gastos';

describe('ApiTallerGastos', () => {
  let service: ApiTallerGastos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiTallerGastos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
