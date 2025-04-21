import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../../../Services/supplier.service'; // Use SupplierService here
import { OrderService } from '../../../Services/order.service';
import { Order } from '../../../Entities/order.model';
import { Supplier } from '../../../Entities/supplier.model';
import { IngredientsService } from 'src/app/features/menumangment/Services/ingredients.service';
import { Ingredients } from 'src/app/features/menumangment/Entities/ingredients';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  orderForm!: FormGroup;
  suppliers: Supplier[] = [];
  ingredients: Ingredients[] = [];
  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private supplierService: SupplierService,
    private ingredientService: IngredientsService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.orderForm = this.fb.group({
      deliveryDate: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      orderStatus: ['', Validators.required],
      supplierID: ['', Validators.required],
      ingId: ['', Validators.required]
    });

    this.loadSuppliers();
    this.loadIngredients();
  }

  loadSuppliers(): void {
    this.supplierService.getAllSuppliers().subscribe({
      next: (data) => {
        this.suppliers = data;
      },
      error: (err) => {
        console.error('Error fetching suppliers:', err);
        alert('Error while loading suppliers');
      }
    });
  }
  loadIngredients(): void {
    this.ingredientService.getIngredients().subscribe({
      next: (data) => {
        this.ingredients = data;
      },
      error: (err) => {
        console.error('Error fetching ingredients:', err);
        alert('Error while loading ingredients');
      }
    });
  }
  onSubmit() {
    const rawValue = this.orderForm.value;
    console.log('Form raw value:', rawValue);

    const order = {
      deliveryDate: rawValue.deliveryDate,
      quantity: rawValue.quantity,
      orderStatus: rawValue.orderStatus,  // Capture the selected status from the form
      supplier: {
        supplierID: Number(rawValue.supplierID)
      },
      ingredient: {
        ingId: Number(rawValue.ingId)
      }
    };
    order.deliveryDate = new Date(order.deliveryDate).toISOString().split('T')[0] + 'T00:00:00';
    console.log('Order sent to backend:', order);

    this.orderService.createOrder(order).subscribe({
      next: response =>{
        console.log('Order created:', response);
        this.router.navigate(['/admin/orders/ordermanagement/orders']); // ← chemin vers ta liste des commandes
      },
        
      error: (error) => {
        console.error('Error creating order:', error);
      }
    });
  }
  
  
}
