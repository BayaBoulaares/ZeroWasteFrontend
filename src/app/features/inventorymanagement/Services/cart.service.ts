import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private orderCount = new BehaviorSubject<number>(0);
  orderCount$ = this.orderCount.asObservable();

  private orderedProducts: any[] = [];
  private orderedProductsSubject = new BehaviorSubject<any[]>([]);
  orderedProducts$ = this.orderedProductsSubject.asObservable();

  addOrder(product: any): void {
    const existing = this.orderedProducts.find(p => p.productId === product.productId && p.productName === product.productName);
  
    if (existing) {
      // Si déjà présent, on augmente juste la quantité
      existing.orderKg += product.orderKg;
    } else {
      // Sinon, on ajoute comme une nouvelle ligne
      this.orderedProducts.push({ ...product });
    }
  
    // Met à jour les observables
    this.orderedProductsSubject.next(this.orderedProducts);
    this.orderCount.next(this.orderedProducts.length);
  }

  clearOrders(): void {
    this.orderedProducts = [];
    this.orderedProductsSubject.next([]);
    this.orderCount.next(0);
  }
  removeOrder(productId: number): void {
    const index = this.orderedProducts.findIndex(p => p.productId === productId);
    if (index !== -1) {
      this.orderedProducts.splice(index, 1);
      this.orderedProductsSubject.next(this.orderedProducts);
      this.orderCount.next(this.orderedProducts.length);
    }
  }
  
  
}
