import { Component, OnInit } from '@angular/core';
import {  EmployeeProfileService } from '../../../Services/EmployeeProfile.service';
import { Employee } from '../../../Entities/employee.model';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.css']
})
export class EmployeeInfoComponent implements OnInit {
  employee: Employee | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(private employeeProfileService: EmployeeProfileService) { }

  ngOnInit(): void {
    this.loadEmployeeInfo();
  }

  loadEmployeeInfo(): void {
    this.loading = true;
    this.employeeProfileService.getMyInfo().subscribe({
      next: (data) => {
        this.employee = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load employee information';
        this.loading = false;
        console.error('Error fetching employee info:', err);
      }
    });
  }
}