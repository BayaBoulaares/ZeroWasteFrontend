import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { InventoryService } from "../../../Services/inventory.service";
import { ActivatedRoute, Router } from "@angular/router";
import { StockTransactionType } from "../../../Entities/stock-transaction-type.enum";
import { StockTransactionService } from "../../../Services/stock-transaction.service";
import { Product } from "../../../Entities/product";
import { StockTransaction } from "../../../Entities/stock-transaction";

@Component({
  selector: 'app-stock-transaction-form',
  templateUrl: './stock-transaction-form.component.html',
  styleUrls: ['./stock-transaction-form.component.css']
})
export class StockTransactionFormComponent implements OnInit {
  stockTransactionForm!: FormGroup;
  isEditMode = false;
  stockTransactionalId!: number;
  StockTransactionType = Object.values(StockTransactionType);
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private stockTransactionService: StockTransactionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.stockTransactionForm = this.fb.group({
      Type: ['', Validators.required],
      productName: ['', Validators.required],
      ChangeQuantity: [0, [Validators.required, Validators.min(0)]],
      DateTransaction: ['']
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.stockTransactionalId = +id;
        this.loadStockTransaction(this.stockTransactionalId);
      }
    });

    this.getProduct();
  }

  loadStockTransaction(id: number) {
    this.stockTransactionService.getStockTransactionById(id).subscribe(transaction => {
      this.stockTransactionForm.patchValue(transaction);
    });
  }

  getProduct() {
    this.inventoryService.getAllProducts().subscribe((data) => {
      this.products = data;
    });
  }

  onSubmit(): void {
    if (this.stockTransactionForm.valid) {
      const formValue = this.stockTransactionForm.value;

      const newTransaction: StockTransaction = {
        stockTransactionID: 0,
        productName: formValue.productName,
        type: formValue.Type,
        changeQuantity: formValue.ChangeQuantity,
        dateTransaction: formValue.dateTransaction || new Date().toISOString(),
      };

      console.log('Objet envoyé :', newTransaction);

      this.stockTransactionService.addStockTransaction(newTransaction.productName,newTransaction).subscribe(
        response => {
          console.log('Transaction ajoutée avec succès:', response);
          this.router.navigate(['/admin/inventory/stockTransaction']);
        },
        error => {
          console.error('Erreur lors de l\'ajout de la transaction:', error);
          if (error.error) {
            console.log('Détails de l\'erreur :', error.error);
          }
        }
      );
    }
  }

  onCancel() {
    this.router.navigate(['/products']);
  }

 
}
