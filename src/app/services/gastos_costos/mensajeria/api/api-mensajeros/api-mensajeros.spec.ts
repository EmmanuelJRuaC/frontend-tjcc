import { TestBed } from '@angular/core/testing';

import { ApiMensajeros } from './api-mensajeros';

describe('ApiMensajeros', () => {
  let service: ApiMensajeros;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiMensajeros);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
