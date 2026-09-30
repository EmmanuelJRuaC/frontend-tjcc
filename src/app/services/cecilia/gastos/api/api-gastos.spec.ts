import { TestBed } from '@angular/core/testing';

import { ApiGastos } from './api-gastos';

describe('ApiGastos', () => {
  let service: ApiGastos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiGastos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
