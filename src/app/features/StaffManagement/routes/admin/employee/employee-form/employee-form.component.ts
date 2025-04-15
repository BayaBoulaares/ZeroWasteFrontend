import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/features/StaffManagement/Entities/employee.model';
import { EmployeeService } from 'src/app/features/StaffManagement/Services/employee.service';


@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId?: number;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required]],
      role: ['', [Validators.required]],
      contactinfo: ['', [Validators.required, Validators.email]],
      salary: ['', [Validators.required, Validators.min(0)]],
      hiredate: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.employeeId = +this.route.snapshot.params['id'];
    this.isEditMode = !!this.employeeId;

    if (this.isEditMode) {
      this.loading = true;
      this.employeeService.getEmployeeById(this.employeeId).subscribe({
        next: (employee) => {
          // Format date to yyyy-MM-dd for input[type="date"]
          const hireDate = new Date(employee.hiredate);
          const formattedDate = hireDate.toISOString().split('T')[0];
          
          this.employeeForm.patchValue({
            ...employee,
            hiredate: formattedDate
          });
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load employee details. Please try again later.';
          console.error('Error loading employee:', err);
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.employeeForm.invalid) {
      return;
    }

    this.loading = true;
    const employeeData: Employee = this.employeeForm.value;

    if (this.isEditMode && this.employeeId !== undefined) {
      employeeData.idEmployee = this.employeeId;
      this.employeeService.updateEmployee(employeeData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/admin/staffmanagement/employees'], { 
            queryParams: { success: 'updated' } 
          });
        },
        error: (err) => {
          this.error = 'Failed to update employee. Please try again later.';
          console.error('Error updating employee:', err);
          this.loading = false;
        }
      });
    } else {
      this.employeeService.createEmployee(employeeData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/admin/staffmanagement/employees'], { 
            queryParams: { success: 'created' } 
          });
        },
        error: (err) => {
          this.error = 'Failed to create employee. Please try again later.';
          console.error('Error creating employee:', err);
          this.loading = false;
        }
      });
    }
  }
}