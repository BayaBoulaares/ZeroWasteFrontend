import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../Entities/order.model';
import { Supplier } from '../Entities/supplier.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:8089/gaspillagezero/orders';
  private suppliersUrl = 'http://localhost:8089/gaspillagezero/suppliers';

  constructor(private http: HttpClient) { }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrdersBySupplier(supplierId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/suplier/${supplierId}`);
  }
getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);  
  }
  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.suppliersUrl);
  }

  findByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/status/${status}`);
  }

  createOrder(order: any): Observable<any> {

    return this.http.post('http://localhost:8089/gaspillagezero/orders/create', order);
  }
 

  updateOrder(id: number, order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, order);
  }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  // order.service.ts
  updateOrderStatus(orderId: number, updatedOrder: Order) {
    return this.http.put<Order>(`http://localhost:8089/gaspillagezero/orders/${orderId}`, updatedOrder);
  }

  getCountOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/count`);
  }

}
