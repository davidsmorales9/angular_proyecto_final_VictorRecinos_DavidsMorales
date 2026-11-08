import { TestBed } from '@angular/core/testing';

import { Respaldo } from './respaldo';

describe('Respaldo', () => {
  let service: Respaldo;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Respaldo);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
