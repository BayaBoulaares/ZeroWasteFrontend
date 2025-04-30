import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from 'src/consts';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private base_url = `${BASE_URL}/salesRecord`; 

  constructor(private http: HttpClient) {}

  addSalesRecord(sale: any): Observable<any> {
    return this.http.post(`${this.base_url}/addSalesRecord`, sale);

  }
}
