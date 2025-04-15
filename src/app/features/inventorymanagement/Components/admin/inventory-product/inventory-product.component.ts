
//import {Menus} from "../../../../Entities/menus";
//import {MenusService} from "../../../../Services/menus.service";
import {Product} from "../../../Entities/product";
import {InventoryService} from "../../../Services/inventory.service";
import {Router} from "@angular/router";
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-inventory-product',
  templateUrl: './inventory-product.component.html',
  styleUrls: ['./inventory-product.component.css']
})
export class InventoryProductComponent implements OnInit{
  products: Product[]=[];

  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(private inventoryService: InventoryService,private router: Router){}

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct() {
    this.inventoryService.getAllProducts().subscribe((data) => {
      this.products = data;
      console.log(this.products);
    });
  }

  onEdit(product: Product) {
    this.router.navigate(['admin/inventory/product/update/' + product.productID]);
  }

  onDelete(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.inventoryService.deleteProduct(productId).subscribe(() => {
        this.getProduct();
      });
    }
  }
  navigateToAdd() {
    this.router.navigate(['admin/inventory/product/add']);
  }
  
}
