import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Ingredients } from '../Entities/ingredients';
import { BASE_URL } from 'src/consts';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {
  private base_url = `${BASE_URL}/Ingredients`;
  constructor(private httpClient: HttpClient) { }
  getIngredients(): Observable<Ingredients[]> {
    return this.httpClient.get<Ingredients[]>(`${this.base_url}/retreiveAllIngredients`)
  }

  addIngredient(ingredient: Ingredients): Observable<Ingredients> {
    return this.httpClient.post<Ingredients>(`${this.base_url}/addIngredient`, ingredient);
  }
  delete(id: number) {
    return this.httpClient.delete<Ingredients>(`${this.base_url}/deleteIngredient/${id}`)

  }
  update(ingredient: Ingredients): Observable<Ingredients> {
    return this.httpClient.put<Ingredients>(`${this.base_url}/updateIngredient/${ingredient.ingId}`, ingredient);
  }
  getIngredient(id: number): Observable<Ingredients> {
    return this.httpClient.get<Ingredients>(`${this.base_url}/retriveIngredient/${id}`);
  }
  searchIngredient(name: string): Observable<Ingredients[]> {
    return this.httpClient.get<Ingredients[]>(`${this.base_url}/search?name=${name}`);
  }
  getIngredientsExpiringSoon(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.base_url}/expiring-soon`);
  }
}
