import { TestBed } from '@angular/core/testing';

import { ApiMensajeria } from './api-mensajeria';

describe('ApiMensajeria', () => {
  let service: ApiMensajeria;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiMensajeria);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
