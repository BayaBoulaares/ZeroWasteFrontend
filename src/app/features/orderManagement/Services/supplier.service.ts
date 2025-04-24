import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier } from '../Entities/supplier.model';
import { Order } from '../Entities/order.model';  // Adjust the import path as necessary
 // Adjust the import path as necessary
@Injectable({ providedIn: 'root' })
export class SupplierService {
  private apiUrl = 'http://localhost:8089/gaspillagezero/suppliers';

  constructor(private http: HttpClient) {}

  getAllSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  createSupplier(supplier: Supplier): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, supplier);
  }

  updateSupplier(id: number, supplier: Supplier): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, supplier);
  }
  
  
  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getCountSuppliers(): Observable<void> {
    return this.http.get<void>(`${this.apiUrl}/count`);
  }
  // supplier.service.ts
toggleFavorite(supplierId: number): Observable<void> {
  return this.http.patch<void>(`${this.apiUrl}/${supplierId}/favorite`, {});
}

getFavoriteSuppliers(): Observable<Supplier[]> {
  return this.http.get<Supplier[]>(`${this.apiUrl}/favorites`);
}
}
