import { Component, OnInit } from '@angular/core';
import { SafetyInspectionService } from '../../../Services/safety-inspection.service';
import { SafetyInspection } from '../../../Entities/safety-inspection';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from '../../../Services/restaurant.service';
import { InspectionStatus, InspectionType } from '../../../Entities/safety-inspection';
import { Restaurant } from '../../../Entities/restaurant'; // Assuming you have a Restaurant interface

interface CalendarEvent {
  date: Date;
  title: string;
  inspector: string;
  type: string;
}

@Component({
  selector: 'app-frontinspection',
  templateUrl: './frontinspection.component.html',
  styleUrls: ['./frontinspection.component.css']
})
export class FrontinspectionComponent implements OnInit {
  inspections: SafetyInspection[] = [];
  safetyMetrics = {
    safetyScore: 0,
    monthlyInspections: 0,
    complianceRate: 0
  };
  selectedDate: Date | null = null;
  events: CalendarEvent[] = [];
  restaurants: Restaurant[] = [];
  inspectionTypes = Object.values(InspectionType);
  inspectionStatuses = Object.values(InspectionStatus);
  inspectionForm: FormGroup;
  isEditing = false;
  selectedInspection: SafetyInspection | null = null;

  constructor(
    private safetyService: SafetyInspectionService,
    private restaurantService: RestaurantService,
    private fb: FormBuilder
  ) {
    this.inspectionForm = this.initForm();
  }

  ngOnInit(): void {
    this.loadInspections();
    this.loadRestaurants();
    this.inspectionForm.valueChanges.subscribe(() => {
      const controls = this.inspectionForm.controls;
      Object.keys(controls).forEach(key => {
        const control = controls[key];
        if (control.errors) {
          console.log(`${key} errors:`, control.errors);
        }
      });
      console.log('Form valid:', this.inspectionForm.valid);
    });
  }
  
  private initForm(): FormGroup {
    return this.fb.group({
    
      inspector_name: ['', [Validators.required]],
      premises_name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      inspection_date: ['', [Validators.required]],
      inspectionType: [InspectionType.Inspection],
      inspectionStatus: [InspectionStatus.Pass],
      infractions: [''],
      crucial_infractions: [0],  // Removed required validator since it has a default value
      significant_infractions: [0],  // Removed required validator since it has a default value
      minor_infractions: [0],  // Removed required validator since it has a default value
      corrected_during_inspection: [0],
      report_time: [''],
      description: [''],
      reinspectionDate: [''],
      isOutOfBusiness: [false],
      restaurant: ['', [Validators.required]]  // Changed null to empty string as default
    });
  }

  // Add this method to debug form validation
  

  
  loadRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
      },
      error: (error) => {
        console.error('Error loading restaurants:', error);
      }
    });
  }

  loadInspections(): void {
    this.safetyService.getAllSafetyInspections().subscribe({
      next: (data) => {
        this.inspections = data;
        this.calculateMetrics();
        this.processCalendarEvents();
      },
      error: (error) => {
        console.error('Error loading inspections:', error);
      }
    });
  }

  calculateMetrics(): void {
    if (this.inspections.length === 0) return;

    // Calculate safety score (based on infractions)
    const totalScore = this.inspections.reduce((acc, insp) => {
      const totalInfractions = insp.crucial_infractions + insp.significant_infractions + insp.minor_infractions;
      const score = 100 - (totalInfractions * 5); // Deduct 5 points per infraction
      return acc + Math.max(0, score);
    }, 0);
    this.safetyMetrics.safetyScore = Math.round(totalScore / this.inspections.length);

    // Calculate monthly inspections
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    this.safetyMetrics.monthlyInspections = this.inspections.filter(insp => {
      const inspDate = new Date(insp.inspection_date);
      return inspDate.getMonth() === currentMonth && inspDate.getFullYear() === currentYear;
    }).length;

    // Calculate compliance rate
    const passedInspections = this.inspections.filter(insp => 
      insp.inspectionStatus === InspectionStatus.Pass || insp.inspectionStatus === InspectionStatus.Conditional_Pass
    ).length;
    this.safetyMetrics.complianceRate = this.inspections.length > 0 
      ? Math.round((passedInspections / this.inspections.length) * 100 
  ) : 0;
  }

  getStatusClass(status: InspectionStatus): string {
    if (!status) return 'badge bg-secondary';
    
    switch (status.toLowerCase()) {
      case 'pass':
        return 'badge bg-success';
      case 'closed':
        return 'badge bg-danger';
      case 'conditional_pass':
        return 'badge bg-warning';
      default:
        return 'badge bg-secondary';
    }
  }

  processCalendarEvents(): void {
    this.events = this.inspections
      .filter(inspection => new Date(inspection.inspection_date) >= new Date())
      .map(inspection => ({
        date: new Date(inspection.inspection_date),
        title: `Inspection at ${inspection.premises_name}`,
        inspector: inspection.inspector_name,
        type: 'inspection'
      }));
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const hasEvent = this.events.some(event => {
        return this.isSameDate(event.date, cellDate);
      });
      return hasEvent ? 'has-event' : '';
    }
    return '';
  };

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  onDateSelected(event: Date | null): void {
    this.selectedDate = event;
  }

  getEventsForDate(date: Date | null): SafetyInspection[] {
    if (!date) return [];
    return this.inspections.filter(inspection => {
      const inspDate = new Date(inspection.inspection_date);
      return this.isSameDate(inspDate, date);
    });
  }

  onSubmit(): void {
    if (this.inspectionForm.valid) {
      if (this.isEditing && this.selectedInspection) {
        this.updateInspection();
      } else {
        this.createInspection();
      }
    }
  }

  createInspection(): void {
    if (this.inspectionForm.invalid) return;

    const formValue = this.inspectionForm.value;
    const newInspection: SafetyInspection = {
      ...formValue,
      restaurant: {
        restaurantid: formValue.restaurant
      }
    };

    this.safetyService.addSafetyInspection(newInspection).subscribe({
      next: () => {
        console.log('Inspection added successfully');
        this.resetForm();
        this.loadInspections();
      },
      error: (err) => console.error('Error adding inspection:', err)
    });
  }

  updateInspection(): void {
    if (!this.selectedInspection || this.inspectionForm.invalid) return;

    const updatedInspection = {
      ...this.selectedInspection,
      ...this.inspectionForm.value,
      restaurant: {
        restaurantid: this.inspectionForm.value.restaurant
      }
    };

    this.safetyService.updateSafetyInspection(updatedInspection).subscribe({
      next: () => {
        console.log('Inspection updated successfully');
        this.resetForm();
        this.loadInspections();
      },
      error: (error) => {
        console.error('Error updating inspection:', error);
      }
    });
  }

  deleteInspection(id: number): void {
    if (confirm('Are you sure you want to delete this inspection?')) {
      this.safetyService.deleteSafetyInspection(id).subscribe({
        next: () => this.loadInspections(),
        error: (error) => console.error('Error deleting inspection:', error)
      });
    }
  }



  editInspection(inspection: SafetyInspection): void {
    this.isEditing = true;
    this.selectedInspection = inspection;
    
    // Format dates properly
    const formattedInspection = {
      ...inspection,
      inspection_date: inspection.inspection_date ? new Date(inspection.inspection_date).toISOString().split('T')[0] : '',
      reinspectionDate: inspection.reinspectionDate ? new Date(inspection.reinspectionDate).toISOString().split('T')[0] : '',
      report_time: inspection.report_time ? new Date(inspection.report_time).toLocaleTimeString('en-US', { hour12: false }).slice(0, 5) : '',
      restaurant: inspection.restaurant?.restaurantid || ''
    };
  
    this.inspectionForm.patchValue(formattedInspection);
  }

 

  private formatDateForInput(date: Date | string): string {
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    return new Date(date).toISOString().split('T')[0];
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedInspection = null;
    this.inspectionForm.reset({
      inspectionType: InspectionType.Inspection,
      inspectionStatus: InspectionStatus.Pass,
      crucial_infractions: 0,
      significant_infractions: 0,
      minor_infractions: 0,
      isOutOfBusiness: false
    });
  }
}