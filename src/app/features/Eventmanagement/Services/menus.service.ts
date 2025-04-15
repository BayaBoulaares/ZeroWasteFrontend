import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Menus } from '../Entities/menus';

const BASE_URL = 'http://localhost:8089/gaspillagezero';

@Injectable({
  providedIn: 'root'
})
export class MenusService {
  
  private apiUrl = `${BASE_URL}/Menu`;  // match the controller base path

  constructor(private http: HttpClient) { }

  getMenus(): Observable<Menus[]> {
    return this.http.get<Menus[]>(`${this.apiUrl}/retreiveAllMenus`)
      .pipe(
        tap(data => console.log('Menus fetched:', data)),
        catchError(this.handleError)
      );
  }

  getMenuById(id: number): Observable<Menus> {
    return this.http.get<Menus>(`${this.apiUrl}/retriveMenu/${id}`)
      .pipe(
        tap(data => console.log(`Menu fetched with id=${id}:`, data)),
        catchError(this.handleError)
      );
  }

  addMenu(menu: Menus): Observable<Menus> {
    return this.http.post<Menus>(`${this.apiUrl}/addmenu`, menu)
      .pipe(
        tap(data => console.log('Menu added:', data)),
        catchError(this.handleError)
      );
  }

  updateMenu(menu: Menus): Observable<Menus> {
    return this.http.put<Menus>(`${this.apiUrl}/updatemenu`, menu)
      .pipe(
        tap(data => console.log('Menu updated:', data)),
        catchError(this.handleError)
      );
  }

  deleteMenu(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/deletemenu/${id}`)
      .pipe(
        tap(_ => console.log(`Menu deleted with id=${id}`)),
        catchError(this.handleError)
      );
  }

  // These two won't work unless you add Spring Boot endpoints:
  addMenuWithImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/with-image`, formData)
      .pipe(
        tap(data => console.log('Menu with image added:', data)),
        catchError(this.handleError)
      );
  }

  updateMenuWithImage(formData: FormData, id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/with-image/${id}`, formData)
      .pipe(
        tap(data => console.log('Menu with image updated:', data)),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
