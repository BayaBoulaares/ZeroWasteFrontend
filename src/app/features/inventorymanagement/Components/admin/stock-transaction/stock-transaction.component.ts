import {Component, OnInit} from '@angular/core';
import {Product} from "../../../Entities/product";
import {InventoryService} from "../../../Services/inventory.service";
import {Router} from "@angular/router";
import {StockTransaction} from "../../../Entities/stock-transaction";
import {StockTransactionService} from "../../../Services/stock-transaction.service";

@Component({
  selector: 'app-stock-transaction',
  templateUrl: './stock-transaction.component.html',
  styleUrls: ['./stock-transaction.component.css']
})
export class StockTransactionComponent implements OnInit{
  stockTransactions: StockTransaction[]=[];

  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private stockTransactionService: StockTransactionService, private router: Router){}

  ngOnInit(): void {
    this.getstockTransactions();
  }

  getstockTransactions() {
    this.stockTransactionService.getAllStockTransaction().subscribe((data) => {
      this.stockTransactions = data;
      console.log(this.stockTransactions);
    });
  }

  onEdit(stockTransaction: StockTransaction) {
    this.router.navigate(['admin/inventory/stockTransaction/update/' + stockTransaction.stockTransactionID]);
  }

  onDelete(stockTransactionId: number) {
    if (confirm('Are you sure you want to delete this stock transaction?')) {
      this.stockTransactionService.deleteStockTransaction(stockTransactionId).subscribe(() => {
        this.getstockTransactions();
      });
    }
  }
  navigateToAdd() {
    this.router.navigate(['admin/inventory/stockTransaction/add']);
  }
}
