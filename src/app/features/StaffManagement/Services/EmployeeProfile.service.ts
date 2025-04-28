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

  getMyInfo(employeeId: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/info/${employeeId}`);
  }

  getMyShifts(employeeId: number): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${this.apiUrl}/shifts/${employeeId}`);
  }

  getMyTrainingSessions(employeeId: number): Observable<TrainingSession[]> {
    return this.http.get<TrainingSession[]>(`${this.apiUrl}/training-sessions/${employeeId}`);
  }
  
  getMyShiftChangeRequests(employeeId: number): Observable<ShiftChangeRequest[]> {
    return this.http.get<ShiftChangeRequest[]>(`${this.apiUrl}/shift-change-requests/${employeeId}`);
  }
  
  getMyPendingShiftChangeRequests(employeeId: number): Observable<ShiftChangeRequest[]> {
    return this.http.get<ShiftChangeRequest[]>(`${this.apiUrl}/shift-change-requests/${employeeId}/pending`);
  }
  
  respondToShiftChangeRequest(employeeId: number, requestId: number, action: 'ACCEPT' | 'REJECT', message?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/shift-change-requests/${employeeId}/${requestId}/respond`, {
      action: action,
      message: message
    });
  }
}
