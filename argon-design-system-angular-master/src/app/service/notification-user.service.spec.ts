import { TestBed } from '@angular/core/testing';

import { NotificationUserService } from './notification-user.service';

describe('NotificationUserService', () => {
  let service: NotificationUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
