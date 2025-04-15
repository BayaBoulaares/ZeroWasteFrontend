import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Restaurant } from '../Entities/restaurant';
import { BASE_URL } from 'src/consts';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
    private base_url = `${BASE_URL}/Restaurant`;
      constructor(private httpClient: HttpClient) { }

      getAllRestaurants(): Observable<Restaurant[]> {
        return this.httpClient.get<Restaurant[]>(`${this.base_url}/retreiveAllRestaurant`)
      }
    
      addRestaurant(obj: Restaurant): Observable<Restaurant> {
        return this.httpClient.post<Restaurant>(`${this.base_url}/addRestaurant`, obj);
      }
      deleteRestaurant(id: number) {
        return this.httpClient.delete<Restaurant>(`${this.base_url}/deleteRestaurant/${id}`)
    
      }
      updateRestaurant(obj: Restaurant): Observable<Restaurant> {
        return this.httpClient.put<Restaurant>(`${this.base_url}/updateRestaurant/`, obj);
      }
      getRestaurant(id: number): Observable<Restaurant> {
        return this.httpClient.get<Restaurant>(`${this.base_url}/retreiveRestaurant/${id}`);
      }
      
      
}
