import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Product} from "../Entities/product";
import {Observable} from "rxjs";
import { BASE_URL } from 'src/consts';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private base_url = `${BASE_URL}/product`;
    constructor(private httpClient : HttpClient) { }
  
    getAllProducts(): Observable<Product[]>{
  
      return this.httpClient.get<Product[]>(`${this.base_url}/retreiveAllProduct`);
    }
  
  
    updateProduct(idProduct: number,product: Product) : Observable<Product> {
      return this.httpClient.put<Product>(`${this.base_url}/updateProduct/${idProduct}`, product);
    }
  
    deleteProduct(idProduct: number) {
      return this.httpClient.delete<Product>(`${this.base_url}/deleteProduct/${idProduct}`);
    }
  
    getProductById(idProduct: number) {
      return this.httpClient.get<Product[]>(`${this.base_url}/retreiveProduct/${idProduct}`);
    }
  
   
    addProduct(product: any) {
      return this.httpClient.post<Product>(`${this.base_url}/addProduct`, product, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
}
