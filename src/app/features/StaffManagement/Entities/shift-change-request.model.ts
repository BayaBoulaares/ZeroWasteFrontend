import { Employee } from './employee.model';

export interface ShiftChangeRequest {
  idRequest?: number;
  employee: Employee;
  requestDate: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  reason?: string;
  employeeResponse?: string;
}