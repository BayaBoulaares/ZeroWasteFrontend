import { TestBed } from '@angular/core/testing';

import { ShiftRecommendationService } from './shift-recommendation.service';

describe('ShiftRecommendationService', () => {
  let service: ShiftRecommendationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftRecommendationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
