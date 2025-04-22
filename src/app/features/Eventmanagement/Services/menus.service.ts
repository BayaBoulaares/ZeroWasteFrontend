import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Menus } from '../Entities/menus';

const BASE_URL = 'http://localhost:8089/gaspillagezero';

@Injectable({
  providedIn: 'root'
})
export class MenusService {

  private apiUrl = `${BASE_URL}/menu`;  // match the controller base path

  constructor(private http: HttpClient) { }

  // Fetch all menus
  getMenus(): Observable<Menus[]> {
    return this.http.get<Menus[]>(`${this.apiUrl}/retrieveAllMenus`)
      .pipe(
        tap(data => console.log('Menus fetched:', data)),
        catchError(this.handleError)
      );
  }

  // Fetch a menu by its ID
  getMenuById(id: number): Observable<Menus> {
    return this.http.get<Menus>(`${this.apiUrl}/retrieveMenu/${id}`)
      .pipe(
        tap(data => console.log(`Menu fetched with id=${id}:`, data)),
        catchError(this.handleError)
      );
  }

  // Add a new menu without image
  addMenu(menu: Menus): Observable<Menus> {
    return this.http.post<Menus>(`${this.apiUrl}/addmenu`, menu)
      .pipe(
        tap(data => console.log('Menu added:', data)),
        catchError(this.handleError)
      );
  }

  // Update a menu without image
  updateMenu(menu: Menus): Observable<Menus> {
    return this.http.put<Menus>(`${this.apiUrl}/updateMenu`, menu)
      .pipe(
        tap(data => console.log('Menu updated:', data)),
        catchError(this.handleError)
      );
  }

  // Delete a menu by ID
  deleteMenu(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/deleteMenu/${id}`)
      .pipe(
        tap(_ => console.log(`Menu deleted with id=${id}`)),
        catchError(this.handleError)
      );
  }

  // Add a menu with image (FormData)
  addMenuWithImage(menuData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addmenu`, menuData)
      .pipe(
        tap(data => console.log('Menu with image added:', data)),
        catchError(this.handleError)
      );
  }

  // Update a menu with image (FormData)
  updateMenuWithImage(menu: Menus, imageFile: File | null): Observable<Menus> {
    const formData = new FormData();
    // Add menu data as separate fields
    if (menu.menuId !== undefined) {
      formData.append('menuId', menu.menuId.toString());
    }
    formData.append('name', menu.name);
    formData.append('description', menu.description);
    formData.append('price', menu.price.toString());
    formData.append('startDate', menu.startDate.toISOString());
    formData.append('endDate', menu.endDate.toISOString());
    
    // Add the image file if provided
    if (imageFile) {
      formData.append('imageFile', imageFile, imageFile.name);
    }

    return this.http.put<Menus>(`${this.apiUrl}/updateMenu`, formData)
      .pipe(
        tap(data => console.log('Menu with image updated:', data)),
        catchError(this.handleError)
      );
  }

  // Handle errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
