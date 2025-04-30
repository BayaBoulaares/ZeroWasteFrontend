import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from 'src/consts';
import { SafetyInspection } from '../Entities/safety-inspection';


@Injectable({
  providedIn: 'root'
})
export class SafetyInspectionService {

  private baseUrl = `${BASE_URL}/SafetyInspection`; // Spring Boot backend

  constructor(private http: HttpClient) {}

  addSafetyInspection(inspection: SafetyInspection): Observable<SafetyInspection> {
    return this.http.post<SafetyInspection>(`${this.baseUrl}/addSafetyInspection`, inspection);
  }

  updateSafetyInspection(inspection: SafetyInspection): Observable<SafetyInspection> {
    return this.http.put<SafetyInspection>(`${this.baseUrl}/updateSafetyInspection`, inspection);
  }

  getAllSafetyInspections(): Observable<SafetyInspection[]> {
    return this.http.get<SafetyInspection[]>(`${this.baseUrl}/retreiveAllSafetyInspection`);
  }

  getSafetyInspectionById(id: number): Observable<SafetyInspection> {
    return this.http.get<SafetyInspection>(`${this.baseUrl}/retreiveSafetyInspection/${id}`);
  }

  deleteSafetyInspection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteSafetyInspection/${id}`);
  }
}
