import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Shift } from '../Entities/shift.model';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private apiUrl = 'http://localhost:8089/gaspillagezero/api/shifts';

  constructor(private http: HttpClient) { }
  
  // Helper function to normalize time format
  private normalizeTimeFormat(timeStr: string): string {
    if (!timeStr) return '';
    
    // If it has more than 2 colons, it's malformed
    const parts = timeStr.split(':');
    if (parts.length > 3) {
      return `${parts[0]}:${parts[1]}:${parts[2]}`;
    }
    
    // Add seconds if not present
    if (parts.length === 2) {
      return `${timeStr}:00`;
    }
    
    return timeStr;
  }

  // Prepare data before sending to server
  private prepareShiftData(shift: any): any {
    return {
      ...shift,
      starttime: this.normalizeTimeFormat(shift.starttime),
      endtime: this.normalizeTimeFormat(shift.endtime)
    };
  }

  getAllShifts(): Observable<Shift[]> {
    return this.http.get<Shift[]>(this.apiUrl);
  }

  getShiftById(id: number): Observable<Shift> {
    return this.http.get<Shift>(`${this.apiUrl}/${id}`);
  }

  // Added method to get shifts by employee
  getShiftsByEmployee(employeeId: number): Observable<Shift[]> {
    return this.http.get<Shift[]>(`${this.apiUrl}/employee/${employeeId}`);
  }

  createShift(shift: any): Observable<Shift> {
    const preparedData = this.prepareShiftData(shift);
    console.log('Creating shift with data:', preparedData);
    return this.http.post<Shift>(this.apiUrl, preparedData);
  }

  updateShift(shift: any): Observable<Shift> {
    const preparedData = this.prepareShiftData(shift);
    console.log('Updating shift with data:', preparedData);
    return this.http.put<Shift>(this.apiUrl, preparedData);
  }

  deleteShift(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}