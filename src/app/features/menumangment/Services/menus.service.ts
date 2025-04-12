import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Menus } from '../Entities/menus';
import { Meals } from '../Entities/meals';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  constructor(private httpClient : HttpClient) { }

  getMenus(): Observable<Menus[]>{
   return this.httpClient.get<Menus[]>('http://localhost:8089/gaspillagezero/Menu/retreiveAllMenus')  
  }

  getMenu(id: number): Observable<Menus> {
    return this.httpClient.get<Menus>(`http://localhost:8089/gaspillagezero/Menu/retriveMenu/${id}`);
  }

  getMeals(): Observable<Meals[]> {
      return this.httpClient.get<Meals[]>('http://localhost:8089/gaspillagezero/Meal/retreiveAllMeals')
  }

  getMenuWithMeals(id: number): Observable<any> {
    return this.httpClient.get<any>(`http://localhost:8089/gaspillagezero/Menu/${id}/meals`);
  }
}
