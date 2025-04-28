import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../../Services/employee.service';
import { ShiftRecommendationService } from '../../../Services/shift-recommendation.service';
import { ShiftService } from '../../../Services/shift.service';


@Component({
  selector: 'app-shift-recommendation',
  templateUrl: './shift-recommendation.component.html',
  styleUrls: ['./shift-recommendation.component.css']
})
export class ShiftRecommendationComponent implements OnInit {
  recommendationForm: FormGroup;
  shiftCreationForm: FormGroup;
  loading = false;
  submitting = false;
  error = '';
  successMessage = '';
  recommendations: any = null;
  roles: string[] = [];
  selectedEmployee: any = null;
  
  constructor(
    private fb: FormBuilder,
    private recommendationService: ShiftRecommendationService,
    private employeeService: EmployeeService,
    private shiftService: ShiftService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.recommendationForm = this.fb.group({
      date: [this.getTomorrow(), Validators.required],
      startTime: ['09:00', Validators.required],
      endTime: ['17:00', Validators.required],
      role: ['', Validators.required]
    });

    // Initialize shift creation form
    this.shiftCreationForm = this.fb.group({
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      employeeId: ['', Validators.required],
      employeeName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadRoles();

    // Check for query parameters
    this.route.queryParams.subscribe(params => {
      if (params['date']) {
        this.recommendationForm.patchValue({
          date: params['date']
        });
      }
      
      if (params['startTime']) {
        this.recommendationForm.patchValue({
          startTime: params['startTime']
        });
      }
      
      if (params['endTime']) {
        this.recommendationForm.patchValue({
          endTime: params['endTime']
        });
      }
      
      if (params['role']) {
        this.recommendationForm.patchValue({
          role: params['role']
        });
      }
    });
  }

  loadRoles(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        // Extract unique roles from employees
        this.roles = [...new Set(employees.map(emp => emp.employeeRole))];
      },
      error: (err) => {
        console.error('Error loading employee roles:', err);
        this.error = 'Failed to load employee roles';
      }
    });
  }

  getTomorrow(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.recommendationForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.recommendations = null;
    this.selectedEmployee = null;

    const formValue = this.recommendationForm.value;
    
    this.recommendationService.getRecommendations(
      formValue.date,
      formValue.startTime + ':00',
      formValue.endTime + ':00',
      formValue.role
    ).subscribe({
      next: (data) => {
        this.recommendations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error getting recommendations:', err);
        this.error = 'Failed to get AI recommendations. Please try again.';
        this.loading = false;
      }
    });
  }

  clearResults(): void {
    this.recommendations = null;
    this.selectedEmployee = null;
  }

  // Format multiline text for display with line breaks
  formatAIResponse(text: string): string {
    if (!text) return '';
    return text.replace(/\n/g, '<br>');
  }

  // Extract employee data from AI recommendations
  extractEmployees(): any[] {
    if (!this.recommendations || !this.recommendations[0]?.aiRecommendations) {
      return [];
    }
  
    const aiText = this.recommendations[0].aiRecommendations;
    const employeeData = [];
    
    // Updated regex to match the new format where ID is after the name with a colon
    const regex = /\*\*([^(]*?)\s*\(ID:\s*(\d+)\)(?::\*\*|\**:)/g;
    let match;
  
    while ((match = regex.exec(aiText)) !== null) {
      const employeeName = match[1].trim();
      const employeeId = parseInt(match[2]);
      
      // Determine suitability based on position in the list
      // First employee is High, others are Medium unless explicitly stated
      let suitability = 'Medium';
      if (employeeData.length === 0) {
        suitability = 'High';
      }
      
      // Extract the explanation/rationale text
      let explanation = '';
      const startIdx = match.index + match[0].length;
      
      // Find the next employee or the "Employee Not Recommended" section
      const nextEmployeeMatch = aiText.substring(startIdx).match(/\*\*([^(]*?)\s*\(ID:\s*(\d+)\)|(\*\*Employee Not Recommended:\*\*)/);
      
      if (nextEmployeeMatch) {
        const endIdx = startIdx + nextEmployeeMatch.index;
        explanation = aiText.substring(startIdx, endIdx);
      } else {
        // If no next employee, take text until the end or until "Employee Not Recommended"
        const notRecommendedIdx = aiText.indexOf('**Employee Not Recommended:**', startIdx);
        if (notRecommendedIdx !== -1) {
          explanation = aiText.substring(startIdx, notRecommendedIdx);
        } else {
          explanation = aiText.substring(startIdx);
        }
      }
      
      // Clean up the explanation: extract "Rationale" section
      const rationaleMatch = explanation.match(/\*\*Rationale:\*\*\s*(.*?)(?=\n\n|\n\*\*|$)/s);
      if (rationaleMatch) {
        explanation = rationaleMatch[1].trim();
      } else {
        // If no explicit "Rationale" section, look for text after bullet point
        const bulletPointMatch = explanation.match(/\*\s*(.*?)(?=\n\n|\n\*\*|$)/s);
        if (bulletPointMatch) {
          explanation = bulletPointMatch[1].trim();
        } else {
          // Just clean up whatever we have
          explanation = explanation
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .trim();
        }
      }
      
      employeeData.push({
        id: employeeId,
        name: employeeName,
        suitability: suitability,
        explanation: explanation,
        rank: employeeData.length + 1 // Add ranking (1-based)
      });
    }
  
    return employeeData;
  }
  // Select an employee from the recommendations
  selectEmployee(employee: any): void {
    this.selectedEmployee = employee;
    
    // Update the shift creation form
    this.shiftCreationForm.patchValue({
      date: this.recommendationForm.value.date,
      startTime: this.recommendationForm.value.startTime,
      endTime: this.recommendationForm.value.endTime,
      employeeId: employee.id,
      employeeName: employee.name
    });
  }

  // Create a shift with the selected employee
  createShift(): void {
    if (this.shiftCreationForm.invalid || !this.selectedEmployee) {
      return;
    }

    this.submitting = true;
    
    const shiftData = {
      date: this.shiftCreationForm.value.date,
      startTime: this.shiftCreationForm.value.startTime + ':00', // Use startTime not starttime
      endTime: this.shiftCreationForm.value.endTime + ':00',     // Use endTime not endtime
      employee: {
        idEmployee: this.selectedEmployee.id
      }
    };

    console.log('Sending shift data:', shiftData);
    this.shiftService.createShift(shiftData).subscribe({
      next: () => {
        this.successMessage = 'Shift created successfully!';
        this.submitting = false;
        
        // Reset selected employee after successful creation
        setTimeout(() => {
          this.router.navigate(['/admin/staffmanagement/shifts'], {
            queryParams: { success: 'created' }
          });
        }, 1500);
      },
      error: (err) => {
        console.error('Error creating shift:', err);
        this.error = 'Failed to create shift. Please try again.';
        this.submitting = false;
      }
    });
  }
  // Cancel employee selection
  cancelSelection(): void {
    this.selectedEmployee = null;
  }

  // Get suitability badge class
  getSuitabilityClass(suitability: string): string {
    switch(suitability.toLowerCase()) {
      case 'high':
        return 'bg-success';
      case 'medium':
        return 'bg-primary';
      case 'low':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }
}