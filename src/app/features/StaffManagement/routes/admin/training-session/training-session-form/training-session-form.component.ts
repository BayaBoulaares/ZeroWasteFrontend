import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/features/StaffManagement/Entities/employee.model';
import { TrainingSession } from 'src/app/features/StaffManagement/Entities/training-session.model';
import { EmployeeService } from 'src/app/features/StaffManagement/Services/employee.service';
import { TrainingSessionService } from 'src/app/features/StaffManagement/Services/training-session.service';


@Component({
  selector: 'app-training-session-form',
  templateUrl: './training-session-form.component.html',
  styleUrls: ['./training-session-form.component.scss']
})
export class TrainingSessionFormComponent implements OnInit {
  sessionForm: FormGroup;
  isEditMode = false;
  sessionId?: number;
  loading = false;
  submitted = false;
  error = '';
  employees: Employee[] = [];

  constructor(
    private fb: FormBuilder,
    private trainingSessionService: TrainingSessionService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.sessionForm = this.fb.group({
      topic: ['', [Validators.required]],
      date: ['', [Validators.required]],
      trainer: ['', [Validators.required]],
      employeeId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
    
    this.sessionId = +this.route.snapshot.params['id'];
    this.isEditMode = !!this.sessionId;

    if (this.isEditMode) {
      this.loading = true;
      this.trainingSessionService.getTrainingSessionById(this.sessionId).subscribe({
        next: (session) => {
          // Format date to yyyy-MM-dd for input[type="date"]
          let formattedDate = session.date;
          
          // If date is in ISO format, extract just the date part
          if (session.date && session.date.includes('T')) {
            formattedDate = session.date.split('T')[0];
          }
          
          this.sessionForm.patchValue({
            topic: session.topic,
            date: formattedDate,
            trainer: session.trainer,
            employeeId: session.employee?.idEmployee || ''
          });
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load training session details. Please try again later.';
          console.error('Error loading training session:', err);
          this.loading = false;
        }
      });
    }
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (err) => {
        this.error = 'Failed to load employees. Please try again later.';
        console.error('Error loading employees:', err);
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.sessionForm.invalid) {
      return;
    }

    this.loading = true;
    
    // Create data object that matches the TrainingSession interface
    const sessionData: TrainingSession = {
      topic: this.sessionForm.value.topic,
      date: this.sessionForm.value.date, // Simple date string format 'YYYY-MM-DD'
      trainer: this.sessionForm.value.trainer
    };

    // Add employee if selected
    if (this.sessionForm.value.employeeId) {
      const selectedEmployee = this.employees.find(
        emp => emp.idEmployee === +this.sessionForm.value.employeeId
      );
      
      if (selectedEmployee) {
        sessionData.employee = selectedEmployee;
      }
    }

    // Add ID if in edit mode
    if (this.isEditMode && this.sessionId !== undefined) {
      sessionData.idTrainingSession = this.sessionId;
      
      this.trainingSessionService.updateTrainingSession(sessionData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/admin/staffmanagement/training-sessions'], { 
            queryParams: { success: 'updated' } 
          });
        },
        error: (err) => {
          this.error = 'Failed to update training session. Please try again later.';
          console.error('Error updating training session:', err);
          this.loading = false;
        }
      });
    } else {
      this.trainingSessionService.createTrainingSession(sessionData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/admin/staffmanagement/training-sessions'], { 
            queryParams: { success: 'created' } 
          });
        },
        error: (err) => {
          this.error = 'Failed to create training session. Please try again later.';
          console.error('Error creating training session:', err);
          this.loading = false;
        }
      });
    }
  }
}