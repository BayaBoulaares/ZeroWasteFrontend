import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../Entities/product';
import { BASE_URL } from 'src/consts';

@Injectable({
  providedIn: 'root'
})
export class ProductStatisticsService {
  private base_url = `${BASE_URL}/product-statistics`;

  constructor(private http: HttpClient) { }

  getProductCountByCategory(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.base_url}/category-count`);
  }

  getLowStockProducts(threshold: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base_url}/low-stock/${threshold}`);
  }

  getProductsExpiringInDays(days: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base_url}/expiring-soon/${days}`);
  }

  getAverageStockByCategory(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.base_url}/average-stock`);
  }

  getOutOfStockProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base_url}/out-of-stock`);
  }

  getTopExpensiveProducts(limit: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.base_url}/top-expensive/${limit}`);
  }

  getDashboardStatistics(): Observable<any> {
    return this.http.get(`${this.base_url}/dashboard`);
  }
}