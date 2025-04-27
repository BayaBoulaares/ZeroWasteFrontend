import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/features/StaffManagement/Entities/employee.model';
import { EmployeeService } from 'src/app/features/StaffManagement/Services/employee.service';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = true;
  error = '';
  successMessage = '';
  showAlert = false;
  alertType = 'success';

  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
    
    // Check for query params to show appropriate alerts
    this.route.queryParams.subscribe(params => {
      if (params['success'] === 'created') {
        this.showSuccessAlert('Employee added successfully!');
      } else if (params['success'] === 'updated') {
        this.showSuccessAlert('Employee updated successfully!');
      }
    });
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.loading = false;
      },
      error: (err) => {
        this.showErrorAlert('Failed to load employees. Please try again later.');
        console.error('Error loading employees:', err);
        this.loading = false;
      }
    });
  }

  editEmployee(id: number): void {
    this.router.navigate(['/admin/staffmanagement/employees/edit', id]);
  }

  confirmDelete(id: number): void {
    document.getElementById('confirmDeleteModal' + id)?.classList.add('show');
    document.getElementById('confirmDeleteModal' + id)?.setAttribute('style', 'display: block; padding-right: 17px;');
    document.body.classList.add('modal-open');
    document.body.setAttribute('style', 'overflow: hidden; padding-right: 17px;');
    document.getElementById('backdrop')?.classList.add('modal-backdrop', 'fade', 'show');
  }
  
  cancelDelete(id: number): void {
    document.getElementById('confirmDeleteModal' + id)?.classList.remove('show');
    document.getElementById('confirmDeleteModal' + id)?.setAttribute('style', 'display: none;');
    document.body.classList.remove('modal-open');
    document.body.removeAttribute('style');
    document.getElementById('backdrop')?.classList.remove('modal-backdrop', 'fade', 'show');
  }

  deleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.employees = this.employees.filter(employee => employee.id !== id);
        this.showSuccessAlert('Employee deleted successfully');
        this.cancelDelete(id);
      },
      error: (err) => {
        this.showErrorAlert('Failed to delete employee');
        console.error('Error deleting employee:', err);
        this.cancelDelete(id);
      }
    });
  }
  
  showSuccessAlert(message: string): void {
    this.successMessage = message;
    this.alertType = 'success';
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }
  
  showErrorAlert(message: string): void {
    this.error = message;
    this.alertType = 'danger';
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }
}