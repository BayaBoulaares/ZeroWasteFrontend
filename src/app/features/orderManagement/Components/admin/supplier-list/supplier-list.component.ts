import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../../Services/supplier.service';
import { Supplier } from '../../../Entities/supplier.model';
   // Adjust the import path as necessary
@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html'
})
export class SupplierListComponent implements OnInit {
  suppliers: Supplier[] = [];
  count : any;

  constructor(private supplierService: SupplierService) {}

  ngOnInit(): void {
    this.getAllSuppliers();
    this.getCountSuppliers();
  }
  getAllSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe(data => {
      this.suppliers = data;
    });
  }
  deleteSupplier(id: number): void {
    if (confirm('Are you sure you want to delete this supplier?')) {
      this.supplierService.deleteSupplier(id).subscribe(() => { 
      });
      this.getAllSuppliers();
    }
  }
  getCountSuppliers(): void {
    this.supplierService.getCountSuppliers().subscribe({
      next: (res) => {
        console.log(res);
        this.count = res;  // Update the status in the UI
      },
      error: (err: any) => {
        console.error('Error getting count', err);
      }
    });
  }

}
