import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Meals } from '../Entities/meals';
import { Ingredients } from '../Entities/ingredients';
import { BASE_URL } from 'src/consts';

@Injectable({
  providedIn: 'root'
})
export class MealsService {
  private base_url = `${BASE_URL}/Meal`;
  constructor(private httpClient: HttpClient) { }
  getMeals(): Observable<Meals[]> {

    return this.httpClient.get<Meals[]>(`${this.base_url}/retreiveAllMeals`)

  }
  addMeal(meal: Meals): Observable<Meals> {
    return this.httpClient.post<Meals>(`${this.base_url}/addMeal`, meal);
  }
  delete(id: number) {
    return this.httpClient.delete<Meals>(`${this.base_url}/deleteMeal/${id}`)

  }
  update(meal: Meals): Observable<Meals> {
    return this.httpClient.put<Meals>(`${this.base_url}/updateMeal`, meal);
  }
  getMeal(id: number): Observable<Meals> {
    return this.httpClient.get<Meals>(`${this.base_url}/retriveMeal/${id}`);
  }
  // Method to add meal with image
  addMealWithImage(formData: FormData): Observable<any> {
    return this.httpClient.post(`${this.base_url}/addMeal`, formData);
  }
  // Récupérer l'image du repas
  getImage(imagePath: string): string {
    return `${this.base_url}/retrieveImage/${imagePath}`;
  }
  // Méthode pour obtenir des repas en fonction des ingrédients disponibles
  recommanderRepas(ingredientIds: number[]): Observable<any[]> {
    const params = { ingredientIds: ingredientIds.join(',') };
    return this.httpClient.get<any[]>(`${this.base_url}/recommandation`, { params });
  }

  getRecommendedMeals(): Observable<Meals[]> {
    return this.httpClient.get<Meals[]>(`${this.base_url}/recommended`);
  }
  searchMeal(name: string): Observable<Meals[]> {
    return this.httpClient.get<Meals[]>(`${this.base_url}/searchM?name=${name}`);
  }
  updateMealuWithImage(id: number, formData: FormData): Observable<any> {
    return this.httpClient.put(`${this.base_url}/updateMeal/${id}`, formData);
  }
  getIngredients(): Observable<Ingredients[]> {
    return this.httpClient.get<Ingredients[]>(`${BASE_URL}/Ingredients/retreiveAllIngredients`)
  }
  addMealandAffectIngredients(meal: any, ingredientId: number) {
    return this.httpClient.post(`${this.base_url}/addMealandAffectIngredients/${ingredientId}`, meal);
  }
  getRecommendedDishes(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.base_url}/recommended`);
  }
  // Méthode pour récupérer un repas avec ses ingrédients par ID
  getMealWithIngredients(id: number): Observable<any> {
    return this.httpClient.get<any>(`${this.base_url}/${id}/ingredients`);
  }
  updateIngredients(mealId: number, ingredientIds: number[]): Observable<any> {
    return this.httpClient.put(`${this.base_url}/${mealId}/updateingredients`, ingredientIds);
  }
  getMealsWithDiscounts(): Observable<Meals[]> {
    return this.httpClient.get<Meals[]>(`${this.base_url}/with-discounts`);
  }
  getTopMeals(): Observable<Meals[]> {
    return this.httpClient.get<Meals[]>(`${this.base_url}/top`);
  }
    /*getTopMeals() {
      return of([{ name: 'Pizza', orderCount: 10 }, { name: 'Burger', orderCount: 15 }]); // Juste un exemple
    }*/

  updateMealRating(id: number, rating: number) {
        return this.httpClient.put(`${this.base_url}/${id}/rating`, { rating });
  }
}
