import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InspectionStatus, InspectionType, SafetyInspection } from 'src/app/features/SafetyCompilance/Entities/safety-inspection';
import { RestaurantService } from 'src/app/features/SafetyCompilance/Services/restaurant.service';
import { SafetyInspectionService } from 'src/app/features/SafetyCompilance/Services/safety-inspection.service';

@Component({
  selector: 'app-safety-inspection',
  templateUrl: './safety-inspection.component.html',
  styleUrls: ['./safety-inspection.component.css'],
})
export class SafetyInspectionComponent implements OnInit {
  statusChartData: any;
  statusChartOptions: any;
  inspectionForm!: FormGroup;
  inspections: SafetyInspection[] = [];
  filteredInspections: SafetyInspection[] = [];
  editingInspection: SafetyInspection | null = null;
  searchKeyword = '';
  errorMessage = '';

  InspectionStatus = InspectionStatus;
  InspectionType = InspectionType;
  restaurants: any[] = [];

  constructor(
    private fb: FormBuilder,
    private inspectService: SafetyInspectionService,
    private router: Router,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadInspectionns();
    this.loadRestaurants();
    this.initializeStatusChart(); // Should only be called once
    this.loadCalendarEvents();
  }

  private initializeStatusChart(): void {
    this.inspectService.getAllSafetyInspections().subscribe({
      next: (data) => {
        const statusCounts = data.reduce((acc: any, inspection) => {
          acc[inspection.inspectionStatus] = (acc[inspection.inspectionStatus] || 0) + 1;
          return acc;
        }, {});

        const total = data.length;
        const labels = Object.keys(statusCounts);
        const percentages = labels.map(label => ((statusCounts[label] / total) * 100).toFixed(1));

        this.statusChartData = {
          labels: labels,
          datasets: [{
            data: percentages,
            backgroundColor: ['#198754',  // green for Pass
      '#ffc107',  // yellow for Conditional_Pass
      '#dc3545'   // red for Closed
      ],
          
            hoverBackgroundColor: [
              '#157347',  // darker green for hover
              '#ffca2c',  // darker yellow for hover
              '#bb2d3b'   // darker red for hover
            ]
          }]
        };

        this.statusChartOptions = {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Inspection Status Distribution' },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const count = statusCounts[label];
                  return `${label}: ${value}% (${count} inspections)`;
                }
              }
            }
          }
        };
      },
      error: (err) => console.error('Error loading inspection data for chart:', err)
    });
  }

  loadRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => this.restaurants = data,
      error: (err) => console.error('Error loading restaurants:', err)
    });
  }

  initializeForm(): void {
    this.inspectionForm = this.fb.group({
      inspectionID: [null],
      inspector_name: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\s]*$/)
      ]],
      premises_name: ['', [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z\s]*$/)
      ]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      inspection_date: ['', Validators.required],
      inspectionType: [InspectionType.Inspection, Validators.required],
      inspectionStatus: [InspectionStatus.Pass, Validators.required],
      infractions: ['', Validators.maxLength(500)],
      crucial_infractions: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      significant_infractions: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      minor_infractions: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      corrected_during_inspection: [0, [Validators.required, Validators.min(0)]],
      report_time: [''],
      description: ['', Validators.maxLength(1000)],
      reinspectionDate: [''],
      isOutOfBusiness: [false],
      restaurant: [null]
    });
  }

  loadInspectionns(): void {
    this.inspectService.getAllSafetyInspections().subscribe({
      next: (data) => {
        this.inspections = data;
        this.filteredInspections = [...data];
      },
      error: (err) => {
        console.error('Error loading inspections:', err);
        this.errorMessage = 'Failed to load inspections';
      }
    });
  }

  saveInspection(): void {
    if (this.inspectionForm.invalid) return;

    const formValue = this.inspectionForm.value;
    const newInspection: SafetyInspection = {
      ...formValue,
      restaurant: {
        restaurantid: formValue.restaurant
      }
    };

    this.inspectService.addSafetyInspection(newInspection).subscribe({
      next: () => {
        console.log('Inspection added successfully');
        this.inspectionForm.reset({ inspectionStatus: this.InspectionStatus.Pass });
        this.ngOnInit();
      },
      error: (err) => console.error('Error adding inspection:', err)
    });
  }

  onEdit(inspection: SafetyInspection): void {
    this.editingInspection = new SafetyInspection(
      inspection.inspectionID,
      inspection.inspector_name,
      inspection.inspection_date,
      inspection.premises_name,
      inspection.address,
      inspection.inspectionType,
      inspection.inspectionStatus,
      inspection.infractions,
      inspection.crucial_infractions,
      inspection.significant_infractions,
      inspection.minor_infractions,
      inspection.corrected_during_inspection,
      inspection.report_time,
      inspection.description,
      inspection.reinspectionDate,
      inspection.isOutOfBusiness,
      inspection.restaurant
    );

    this.inspectionForm.patchValue({
      ...inspection,
      inspection_date: this.formatDateForInput(inspection.inspection_date)
    });
  }

  private formatDateForInput(date: Date | string): string {
    return typeof date === 'string' ? date.split('T')[0] : date.toISOString().split('T')[0];
  }

  updateInspection(): void {
    if (!this.editingInspection || this.inspectionForm.invalid) return;

    const updatedInspection = {
      ...this.editingInspection,
      ...this.inspectionForm.value,
    };

    const index = this.inspections.findIndex(
      (insp) => insp.inspectionID === updatedInspection.inspectionID
    );

    if (index !== -1) {
      this.inspections[index] = updatedInspection;
      this.filteredInspections = [...this.inspections];
    }

    this.editingInspection = null;
    this.inspectionForm.reset({ inspectionStatus: InspectionStatus.Pass });
  }

  onDelete(id: number): void {
    this.inspectService.deleteSafetyInspection(id).subscribe({
      next: () => {
        console.log('Inspection deleted successfully');
        this.router.navigate(['/admin/SafetyManagment/SafetyInspection']);
        this.ngOnInit();
      },
      error: (err) => console.error('Error deleting Inspection:', err)
    });
  }

  searchInspections(): void {
    const keyword = this.searchKeyword.toLowerCase().trim();
    this.filteredInspections = keyword ?
      this.inspections.filter(insp =>
        insp.inspector_name?.toLowerCase().includes(keyword) ||
        insp.address?.toLowerCase().includes(keyword) ||
        insp.inspectionStatus?.toString().toLowerCase().includes(keyword))
      : [...this.inspections];
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
    eventClick: this.handleEventClick.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    eventDidMount: (info) => {
      if (info.event.extendedProps['type'] === 'Reinspection') {
        info.el.style.backgroundColor = '#FF6384';
      } else {
        info.el.style.backgroundColor = '#36A2EB';
      }
    }
  };

  selectedFilter: 'all' | 'closeInspection' | 'reinspection' = 'all';

  loadCalendarEvents(): void {
    this.inspectService.getAllSafetyInspections().subscribe({
      next: (inspections) => {
        const events = inspections.map(inspection => ({
          title: `${inspection.inspectionType}: ${inspection.premises_name}`,
          start: inspection.inspection_date,
          end: inspection.inspection_date,
          extendedProps: {
            type: inspection.inspectionType,
            inspection: inspection
          }
        }));
        this.updateCalendarEvents(events);
      },
      error: (error) => console.error('Error loading inspections:', error)
    });
  }

  updateCalendarEvents(allEvents: any[]): void {
    let filteredEvents = [...allEvents];
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

    switch (this.selectedFilter) {
      case 'closeInspection':
        filteredEvents = allEvents.filter(event => {
          const eventDate = new Date(event.start);
          return eventDate >= today && eventDate <= thirtyDaysFromNow;
        });
        break;
      case 'reinspection':
        filteredEvents = allEvents.filter(event => event.extendedProps.type === 'Reinspection');
        break;
    }

    this.calendarOptions.events = filteredEvents;
  }

  handleEventClick(arg: any): void {
    const inspection = arg.event.extendedProps.inspection;
    console.log('Inspection details:', inspection);
  }

  onFilterChange(filter: 'all' | 'closeInspection' | 'reinspection'): void {
    this.selectedFilter = filter;
    this.loadCalendarEvents();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.inspectionForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.inspectionForm.get(fieldName);
    if (control?.errors) {
      if (control.errors['required']) return `${fieldName} is required`;
      if (control.errors['minlength']) return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['maxlength']) return `${fieldName} cannot exceed ${control.errors['maxlength'].requiredLength} characters`;
      if (control.errors['pattern']) {
        if (fieldName === 'inspector_name' || fieldName === 'premises_name') {
          return `${fieldName} must contain only letters and spaces`;
        }
      }
      if (control.errors['min']) return `Value must be ${control.errors['min'].min} or greater`;
      if (control.errors['max']) return `Value cannot exceed ${control.errors['max'].max}`;
    }
    return '';
  }
}