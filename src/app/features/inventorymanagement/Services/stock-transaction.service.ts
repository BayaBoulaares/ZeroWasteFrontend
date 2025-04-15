import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {StockTransaction} from "../Entities/stock-transaction";
import { BASE_URL } from 'src/consts';

@Injectable({
  providedIn: 'root'
})
export class StockTransactionService {
  private base_url = `${BASE_URL}/stockTransaction`;
  constructor(private httpClient : HttpClient) { }

  getAllStockTransaction(): Observable<StockTransaction[]>{

    return this.httpClient.get<StockTransaction[]>(`${this.base_url}/retreiveAllStockTransaction`);
  }


  updateStockTransaction(idStockTrancation: number,stockTransaction: StockTransaction) : Observable<StockTransaction> {
    return this.httpClient.put<StockTransaction>(`${this.base_url}/updateStockTransaction/${idStockTrancation}`, stockTransaction);
  }

  deleteStockTransaction(idStockTrancation: number) {
    return this.httpClient.delete<StockTransaction>(`${this.base_url}/deleteStockTransaction/${idStockTrancation}`);
  }

  getStockTransactionById(idStockTrancation: number) {
    return this.httpClient.get<StockTransaction[]>(`${this.base_url}/retreiveStockTransaction/${idStockTrancation}`);
  }
addStockTransaction(productName: string, stockTransaction: StockTransaction): Observable<StockTransaction> {
    return this.httpClient.post<StockTransaction>(`${this.base_url}/addStockTransaction/${productName}`, stockTransaction);
  }
  

}
