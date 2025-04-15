import { TestBed } from '@angular/core/testing';

import { StockTransactionService } from './stock-transaction.service';

describe('StockTransactionService', () => {
  let service: StockTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
