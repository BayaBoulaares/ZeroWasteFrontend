import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShiftRecommendationService {
  private apiUrl = 'http://localhost:8089/gaspillagezero/api/shift-recommendations';

  constructor(private http: HttpClient) { }

  getRecommendations(date: string, startTime: string, endTime: string, role: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?date=${date}&startTime=${startTime}&endTime=${endTime}&role=${role}`);
  }

  getRawData(date: string, startTime: string, endTime: string, role: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/raw-data?date=${date}&startTime=${startTime}&endTime=${endTime}&role=${role}`);
  }

  postRecommendationsRequest(requestData: any): Observable<any> {
    return this.http.post(this.apiUrl, requestData);
  }
}