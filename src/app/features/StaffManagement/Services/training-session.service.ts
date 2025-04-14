import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TrainingSession } from '../Entities/training-session.model';

@Injectable({
  providedIn: 'root'
})
export class TrainingSessionService {
  private apiUrl = 'http://localhost:8089/gaspillagezero/api/training-sessions';

  constructor(private http: HttpClient) { }

  getAllTrainingSessions(): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getTrainingSessionById(id: number): Observable<TrainingSession> {
    return this.http.get<TrainingSession>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createTrainingSession(trainingSession: TrainingSession): Observable<TrainingSession> {
    console.log('Creating training session with data:', trainingSession);
    return this.http.post<TrainingSession>(this.apiUrl, trainingSession).pipe(
      tap(response => console.log('Server response for create:', response)),
      catchError(this.handleError)
    );
  }

  updateTrainingSession(trainingSession: TrainingSession): Observable<TrainingSession> {
    console.log('Updating training session with data:', trainingSession);
    return this.http.put<TrainingSession>(this.apiUrl, trainingSession).pipe(
      tap(response => console.log('Server response for update:', response)),
      catchError(this.handleError)
    );
  }

  deleteTrainingSession(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage += `\nDetail: ${error.error.message}`;
      }
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}