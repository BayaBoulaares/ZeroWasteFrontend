import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShiftChangeRequest } from '../Entities/shift-change-request.model';

@Injectable({
  providedIn: 'root'
})
export class ShiftChangeRequestService {
  private apiUrl = 'http://localhost:8089/gaspillagezero/api/shift-change-requests';

  constructor(private http: HttpClient) { }
  
  // Admin methods
  getAllRequests(): Observable<ShiftChangeRequest[]> {
    return this.http.get<ShiftChangeRequest[]>(this.apiUrl);
  }
  
  getRequestById(id: number): Observable<ShiftChangeRequest> {
    return this.http.get<ShiftChangeRequest>(`${this.apiUrl}/${id}`);
  }
  
  createRequest(request: ShiftChangeRequest): Observable<ShiftChangeRequest> {
    return this.http.post<ShiftChangeRequest>(this.apiUrl, request);
  }
  
  deleteRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  // Methods for retrieving requests by employee
  getRequestsByEmployeeId(employeeId: number): Observable<ShiftChangeRequest[]> {
    return this.http.get<ShiftChangeRequest[]>(`${this.apiUrl}/employee/${employeeId}`);
  }
  
  getPendingRequestsByEmployeeId(employeeId: number): Observable<ShiftChangeRequest[]> {
    return this.http.get<ShiftChangeRequest[]>(`${this.apiUrl}/employee/${employeeId}/pending`);
  }
}