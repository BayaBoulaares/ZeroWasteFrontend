import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransactionFormComponent } from './stock-transaction-form.component';

describe('StockTransactionFormComponent', () => {
  let component: StockTransactionFormComponent;
  let fixture: ComponentFixture<StockTransactionFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockTransactionFormComponent]
    });
    fixture = TestBed.createComponent(StockTransactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
