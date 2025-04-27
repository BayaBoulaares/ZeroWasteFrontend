import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/features/StaffManagement/Entities/employee.model';
import { EmployeeService } from 'src/app/features/StaffManagement/Services/employee.service';
import { ShiftService } from 'src/app/features/StaffManagement/Services/shift.service';
import { Shift } from 'src/app/features/StaffManagement/Entities/shift.model';

@Component({
  selector: 'app-shift-form',
  templateUrl: './shift-form.component.html',
  styleUrls: ['./shift-form.component.scss']
})
export class ShiftFormComponent implements OnInit {
  shiftForm: FormGroup;
  employees: Employee[] = [];
  isEditMode = false;
  shiftId?: number;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private shiftService: ShiftService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.shiftForm = this.fb.group({
      date: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      employeeId: ['']
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
    
    this.shiftId = +this.route.snapshot.params['id'];
    this.isEditMode = !!this.shiftId;

    if (this.isEditMode) {
      this.loading = true;
      this.shiftService.getShiftById(this.shiftId).subscribe({
        next: (shift) => {
          // Extract only the HH:MM part of the time strings to avoid appending seconds multiple times
          let startTime = shift.startTime;
          let endTime = shift.endTime;
          
          // If they already have seconds, just take the HH:MM part
          if (startTime && startTime.includes(':') && startTime.split(':').length >= 2) {
            const parts = startTime.split(':');
            startTime = `${parts[0]}:${parts[1]}`;
          }
          
          if (endTime && endTime.includes(':') && endTime.split(':').length >= 2) {
            const parts = endTime.split(':');
            endTime = `${parts[0]}:${parts[1]}`;
          }
          
          this.shiftForm.patchValue({
            date: shift.date,
            startTime: startTime,
            endTime: endTime,
            employeeId: shift.employee?.idEmployee || ''
          });
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load shift details. Please try again later.';
          console.error('Error loading shift:', err);
          this.loading = false;
        }
      });
  }}

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.shiftForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Correctly format the data for the backend
    const shiftData: any = {
      date: this.shiftForm.value.date, // Just the date: 'YYYY-MM-DD'
      startTime: this.shiftForm.value.startTime + ':00', // Add seconds if needed: 'HH:MM:SS'
      endTime: this.shiftForm.value.endTime + ':00'      // Add seconds if needed: 'HH:MM:SS'
    };

    // If an employee is selected, add it to the shift
    if (this.shiftForm.value.employeeId) {
      const selectedEmployee = this.employees.find(
        emp => emp.id === +this.shiftForm.value.employeeId
      );
      if (selectedEmployee) {
        shiftData.employee = selectedEmployee;
      }
    }

    console.log('Sending shift data:', shiftData);
    if (this.isEditMode) {
      shiftData.idShift = this.shiftId;
      this.shiftService.updateShift(shiftData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/admin/staffmanagement/shifts'], { 
            queryParams: { success: 'updated' } 
          });
        },
        error: (err) => {
          this.error = 'Failed to update shift. Please try again later.';
          console.error('Error updating shift:', err);
          this.loading = false;
        }
      });
    } else {
      this.shiftService.createShift(shiftData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/admin/staffmanagement/shifts'], { 
            queryParams: { success: 'created' } 
          });
        },
        error: (err) => {
          this.error = 'Failed to create shift. Please try again later.';
          console.error('Error creating shift:', err);
          this.loading = false;
        }
      });
    }
  }
}