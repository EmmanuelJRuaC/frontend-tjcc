import { TestBed } from '@angular/core/testing';

import { ApiSemanasMensajeria } from './api-semanas-mensajeria';

describe('ApiSemanasMensajeria', () => {
  let service: ApiSemanasMensajeria;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiSemanasMensajeria);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
