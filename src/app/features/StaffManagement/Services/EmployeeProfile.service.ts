import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../Entities/employee.model';
import { ShiftChangeRequest } from '../Entities/shift-change-request.model';
import { Shift } from '../Entities/shift.model';
import { TrainingSession } from '../Entities/training-session.model';


@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {
  private apiUrl = 'http://localhost:8089/gaspillagezero/api/employee-profile';

  constructor(private http: HttpClient) { }

  getMyInfo(): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/info`);
  }

  getMyShifts(): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${this.apiUrl}/shifts`);
  }

  getMyTrainingSessions(): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(`${this.apiUrl}/training-sessions`);
  }
  
  // New methods for shift change requests
  getMyShiftChangeRequests(): Observable<ShiftChangeRequest[]> {
    return this.http.get<ShiftChangeRequest[]>(`${this.apiUrl}/shift-change-requests`);
  }
  
  getMyPendingShiftChangeRequests(): Observable<ShiftChangeRequest[]> {
    return this.http.get<ShiftChangeRequest[]>(`${this.apiUrl}/shift-change-requests/pending`);
  }
  
  respondToShiftChangeRequest(id: number, action: 'ACCEPT' | 'REJECT', message?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/shift-change-requests/${id}/respond`, {
      action: action,
      message: message
    });
  }
}