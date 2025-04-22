import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { Meals } from '../Entities/meals';
import { Ingredients } from '../Entities/ingredients';
import { BASE_URL } from 'src/consts';
import { MealRecommendation } from '../models/meal-recommendation';
import { Rating } from '../models/rating';

@Injectable({
  providedIn: 'root'
})
export class MealsService {
  private base_url = `${BASE_URL}/Meal`;
  private base_url2 = `${BASE_URL}/Recommendation`;
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
  updateMealIngredients(mealId: number, ingredients: any[]): Observable<any> {
    return this.httpClient.put(`${this.base_url}/${mealId}/updateingredients`, ingredients, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
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

  /*updateMealRating(id: number, rating: number) {
        return this.httpClient.put(`${this.base_url}/${id}/rating`, { rating });
  }*/
 /* getRecommendation(saison: string, evenement: string, habitude: string): Observable<string[]> {
    const params = { saison, evenement, habitude };
    return this.httpClient.get<string[]>(`${this.base_url2}/get-recommendation`, { params });
  }*/
    private apiUrl = 'http://localhost:8089/gaspillagezero/Recommendation/recommend';
  // Cette méthode envoie la requête pour récupérer la recommandation du plat
  private apiUrl2 = 'http://localhost:8089/gaspillagezero/ratings';

  getMealRecommendations(requestData: any): Observable<any[]> {
    return this.httpClient.post<any[]>(this.apiUrl, requestData);
  }
  removeDiscount(mealId: number): Observable<void> {
    return this.httpClient.put<void>(`${this.base_url}/remove-discount/${mealId}`, {});
  }
  rateMeal(userId: number, mealId: number, stars: number): Observable<any> {
    return this.httpClient.post(`${this.apiUrl2}/rate?userId=${userId}&mealId=${mealId}&stars=${stars}`, {});
  }

  getAverageRating(mealId: number): Observable<number> {
    return this.httpClient.get<number>(`${this.apiUrl2}/average/${mealId}`);
  }
  getMealIngredientsWithQuantities(mealId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.base_url}/${mealId}/ings`);

  }

}
