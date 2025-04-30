import { TestBed } from '@angular/core/testing';

import { SafetyInspectionService } from './safety-inspection.service';

describe('SafetyInspectionService', () => {
  let service: SafetyInspectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SafetyInspectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
