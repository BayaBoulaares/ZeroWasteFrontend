import { Product } from "./product";
export class SalesRecord {

    salesID: number;
    quantitySold: number;
    dateSale: Date;
    total: number;
    product: Product;
    constructor(salesID: number, quantitySold: number, dateSale: Date, total: number, product: Product) {
        this.salesID = salesID;
        this.quantitySold = quantitySold;
        this.dateSale = dateSale;
        this.total = total;
        this.product = product;
    }
}
