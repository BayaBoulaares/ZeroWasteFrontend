import { StockTransactionType } from './stock-transaction-type.enum';

export class StockTransaction {
  stockTransactionID: number;
  type: StockTransactionType;
  dateTransaction: Date;
  changeQuantity: number;
  productName: string; // ✅ utilisé localement

  constructor(
    stockTransactionID: number,
    type: StockTransactionType,
    dateTransaction: Date,
    changeQuantity: number,
    productName: string
  ) {
    this.stockTransactionID = stockTransactionID;
    this.type = type;
    this.dateTransaction = dateTransaction;
    this.changeQuantity = changeQuantity;
    this.productName = productName;
  }
}

