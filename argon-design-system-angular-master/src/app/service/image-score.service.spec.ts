import { TestBed } from '@angular/core/testing';

import { ImageScoreService } from './image-score.service';

describe('ImageScoreService', () => {
  let service: ImageScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
