import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Shift } from 'src/app/features/StaffManagement/Entities/shift.model';
import { Employee } from 'src/app/features/StaffManagement/Entities/employee.model';
import { ShiftChangeRequest } from 'src/app/features/StaffManagement/Entities/shift-change-request.model';
import { ShiftService } from 'src/app/features/StaffManagement/Services/shift.service';
import { EmployeeService } from 'src/app/features/StaffManagement/Services/employee.service';
import { ShiftChangeRequestService } from 'src/app/features/StaffManagement/Services/shift-change-request.service';

interface CalendarDay {
  date: Date | null;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  hasShift: boolean;
  isToday: boolean;
  isSelectable: boolean;
  isSelected: boolean;
}

@Component({
  selector: 'app-shift-list',
  templateUrl: './shift-list.component.html',
  styleUrls: ['./shift-list.component.scss']
})
export class ShiftListComponent implements OnInit {
  shifts: Shift[] = [];
  loading = true;
  error = '';
  successMessage = '';
  showAlert = false;
  alertType = 'success';
  
  // For the calendar and request modal
  selectedEmployee: Employee | null = null;
  loadingFreeDays = false;
  calendarDays: CalendarDay[] = [];
  currentMonth: Date = new Date();
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  selectedDate: Date | null = null;
  shiftChangeForm: FormGroup;
  
  // For requests summary
  allRequests: ShiftChangeRequest[] = [];
  filteredRequests: ShiftChangeRequest[] = [];
  loadingRequests = false;
  activeRequestsTab: 'pending' | 'accepted' | 'rejected' = 'pending';
  pendingResponses = 0;

  constructor(
    private shiftService: ShiftService,
    private employeeService: EmployeeService,
    private shiftChangeRequestService: ShiftChangeRequestService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { 
    this.shiftChangeForm = this.fb.group({
      startTime: ['09:00', Validators.required],
      endTime: ['17:00', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadShifts();
    this.loadAllRequests();
    
    // Check for query params to show appropriate alerts
    this.route.queryParams.subscribe(params => {
      if (params['success'] === 'created') {
        this.showSuccessAlert('Shift added successfully!');
      } else if (params['success'] === 'updated') {
        this.showSuccessAlert('Shift updated successfully!');
      }
    });
  }

  loadShifts(): void {
    this.loading = true;
    this.shiftService.getAllShifts().subscribe({
      next: (data) => {
        this.shifts = data;
        this.loading = false;
      },
      error: (err) => {
        this.showErrorAlert('Failed to load shifts. Please try again later.');
        console.error('Error loading shifts:', err);
        this.loading = false;
      }
    });
  }

  editShift(id: number): void {
    this.router.navigate(['/admin/staffmanagement/shifts/edit', id]);
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

  deleteShift(id: number): void {
    this.shiftService.deleteShift(id).subscribe({
      next: () => {
        this.shifts = this.shifts.filter(shift => shift.idShift !== id);
        this.showSuccessAlert('Shift deleted successfully');
        this.cancelDelete(id);
      },
      error: (err) => {
        this.showErrorAlert('Failed to delete shift');
        console.error('Error deleting shift:', err);
        this.cancelDelete(id);
      }
    });
  }
  
  formatTime(time: any): string {
    // Handle null, undefined, or non-string values
    if (!time) return 'N/A';
    
    // Convert to string if it's not already
    const timeStr = String(time);
    
    // If it's already short format (HH:MM), just return it
    if (timeStr.length === 5 && timeStr.includes(':')) {
      return timeStr;
    }
    
    // Handle ISO format or other string formats
    try {
      // Try to extract HH:MM from any string format
      if (timeStr.includes(':')) {
        // Extract hours and minutes from the time string
        const parts = timeStr.split(':');
        if (parts.length >= 2) {
          return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
        }
      }
      
      // If it's a Date object or timestamp, convert
      if (!isNaN(Date.parse(timeStr))) {
        const date = new Date(timeStr);
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      }
    } catch (error) {
      console.error('Error formatting time:', error);
    }
    
    // Return original value if we can't parse it
    return timeStr || 'N/A';
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

  // Calendar and request modal methods
  openEmployeeFreeDaysModal(employee: Employee): void {
    this.selectedEmployee = employee;
    this.selectedDate = null;
    this.shiftChangeForm.reset({
      startTime: '09:00',
      endTime: '17:00',
      reason: ''
    });
    
    document.getElementById('employeeFreeDaysModal')?.classList.add('show');
    document.getElementById('employeeFreeDaysModal')?.setAttribute('style', 'display: block; padding-right: 17px;');
    document.body.classList.add('modal-open');
    document.body.setAttribute('style', 'overflow: hidden; padding-right: 17px;');
    document.getElementById('backdrop')?.classList.add('modal-backdrop', 'fade', 'show');
    
    this.loadEmployeeShifts(employee.id);
  }

  closeEmployeeFreeDaysModal(): void {
    document.getElementById('employeeFreeDaysModal')?.classList.remove('show');
    document.getElementById('employeeFreeDaysModal')?.setAttribute('style', 'display: none;');
    document.body.classList.remove('modal-open');
    document.body.removeAttribute('style');
    document.getElementById('backdrop')?.classList.remove('modal-backdrop', 'fade', 'show');
  }
  
  loadEmployeeShifts(employeeId: number): void {
    this.loadingFreeDays = true;
    this.shiftService.getShiftsByEmployee(employeeId).subscribe({
      next: (data) => {
        // Once we have the employee's shifts, generate the calendar
        this.generateCalendar(data);
        this.loadingFreeDays = false;
      },
      error: (err) => {
        console.error('Error loading employee shifts:', err);
        this.loadingFreeDays = false;
        this.showErrorAlert('Failed to load employee schedule');
      }
    });
  }
  
  generateCalendar(employeeShifts: Shift[]): void {
    this.calendarDays = [];
    
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Current date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Add empty placeholders for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      this.calendarDays.push({ 
        date: null, 
        dayOfMonth: 0,
        isCurrentMonth: false,
        hasShift: false,
        isToday: false,
        isSelectable: false,
        isSelected: false
      });
    }
    
    // Add days of the current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = this.formatDateYMD(date);
      
      // Check if this date has a shift
      const hasShiftOnDay = employeeShifts.some(shift => 
        this.formatDateYMD(new Date(shift.date)) === dateStr
      );
      
      const isToday = date.getFullYear() === today.getFullYear() && 
                      date.getMonth() === today.getMonth() && 
                      date.getDate() === today.getDate();
      
      // Determine if this date is selectable (future date and no shift)
      const isSelectable = date >= today && !hasShiftOnDay;
      
      // Check if this date is the selected date
      const isSelected = this.selectedDate !== null && 
                        date.getFullYear() === this.selectedDate.getFullYear() && 
                        date.getMonth() === this.selectedDate.getMonth() && 
                        date.getDate() === this.selectedDate.getDate();
      
      this.calendarDays.push({
        date: date,
        dayOfMonth: day,
        isCurrentMonth: true,
        hasShift: hasShiftOnDay,
        isToday: isToday,
        isSelectable: isSelectable,
        isSelected: isSelected
      });
    }
    
    // Fill the remaining days of the last week
    const remainingDays = 7 - (this.calendarDays.length % 7);
    if (remainingDays < 7) {
      for (let i = 0; i < remainingDays; i++) {
        this.calendarDays.push({ 
          date: null, 
          dayOfMonth: 0,
          isCurrentMonth: false,
          hasShift: false,
          isToday: false,
          isSelectable: false,
          isSelected: false
        });
      }
    }
  }
  
  formatDateYMD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.selectedDate = null;
    if (this.selectedEmployee) {
      this.loadEmployeeShifts(this.selectedEmployee.id);
    }
  }
  
  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.selectedDate = null;
    if (this.selectedEmployee) {
      this.loadEmployeeShifts(this.selectedEmployee.id);
    }
  }
  
  get currentMonthYear(): string {
    return `${this.monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
  }
  
  selectDate(date: Date | null): void {
    if (date) {
      this.selectedDate = date;
      // Regenerate calendar to show selected date
      if (this.selectedEmployee) {
        this.loadEmployeeShifts(this.selectedEmployee.id);
      }
    }
  }
  
  submitShiftChangeRequest(): void {
    if (this.selectedEmployee && this.selectedDate && this.shiftChangeForm.valid) {
      const formValue = this.shiftChangeForm.value;
      
      const request: ShiftChangeRequest = {
        employee: this.selectedEmployee,
        shiftDate: this.formatDateYMD(this.selectedDate),
        startTime: formValue.startTime + ':00',
        endTime: formValue.endTime + ':00',
        reason: formValue.reason,
        requestDate: this.formatDateYMD(new Date()),
        status: 'PENDING'
      };
      
      this.shiftChangeRequestService.createRequest(request).subscribe({
        next: (response) => {
          this.showSuccessAlert('Shift change request sent successfully!');
          this.closeEmployeeFreeDaysModal();
          // Refresh requests list
          this.loadAllRequests();
        },
        error: (err) => {
          let errorMessage = 'Failed to send shift change request';
          if (err.error && typeof err.error === 'string') {
            errorMessage += ': ' + err.error;
          }
          this.showErrorAlert(errorMessage);
          console.error('Error creating shift change request:', err);
        }
      });
    } else {
      this.shiftChangeForm.markAllAsTouched();
    }
  }
  
  // Requests summary methods
  loadAllRequests(): void {
    this.loadingRequests = true;
    this.shiftChangeRequestService.getAllRequests().subscribe({
      next: (data) => {
        // Log the first request to see its format
        if (data && data.length > 0) {
          console.log('Sample request data:', data[0]);
          console.log('Start time format:', typeof data[0].startTime, data[0].startTime);
          console.log('End time format:', typeof data[0].endTime, data[0].endTime);
        }
        
        this.allRequests = data;
        this.pendingResponses = data.filter(req => req.status === 'PENDING').length;
        this.filterRequests();
        this.loadingRequests = false;
      },
      error: (err) => {
        console.error('Error loading requests:', err);
        this.loadingRequests = false;
      }
    });
  }
  
  filterRequests(): void {
    this.filteredRequests = this.allRequests.filter(req => req.status === this.activeRequestsTab.toUpperCase());
  }
  
  setRequestsTab(tab: 'pending' | 'accepted' | 'rejected'): void {
    this.activeRequestsTab = tab;
    this.filterRequests();
  }
  
  showRequestSummaryModal(): void {
    document.getElementById('requestSummaryModal')?.classList.add('show');
    document.getElementById('requestSummaryModal')?.setAttribute('style', 'display: block; padding-right: 17px;');
    document.body.classList.add('modal-open');
    document.body.setAttribute('style', 'overflow: hidden; padding-right: 17px;');
    document.getElementById('backdrop')?.classList.add('modal-backdrop', 'fade', 'show');
    
    this.loadAllRequests();
  }
  
  closeRequestSummaryModal(): void {
    document.getElementById('requestSummaryModal')?.classList.remove('show');
    document.getElementById('requestSummaryModal')?.setAttribute('style', 'display: none;');
    document.body.classList.remove('modal-open');
    document.body.removeAttribute('style');
    document.getElementById('backdrop')?.classList.remove('modal-backdrop', 'fade', 'show');
  }
  
  cancelRequest(requestId?: number): void {
    if (!requestId) return;
    
    this.shiftChangeRequestService.deleteRequest(requestId).subscribe({
      next: () => {
        this.showSuccessAlert('Request canceled successfully');
        this.loadAllRequests();
      },
      error: (err) => {
        this.showErrorAlert('Failed to cancel request');
        console.error('Error canceling request:', err);
      }
    });
  }
}