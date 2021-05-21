import { TestBed } from '@angular/core/testing';

import { UrlMainService } from './url-main.service';

describe('UrlMainService', () => {
  let service: UrlMainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UrlMainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
