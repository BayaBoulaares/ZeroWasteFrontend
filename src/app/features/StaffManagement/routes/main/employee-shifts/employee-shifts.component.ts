import { Component, OnInit } from '@angular/core';
import { EmployeeProfileService } from '../../../Services/EmployeeProfile.service';
import { Shift } from '../../../Entities/shift.model';

@Component({
  selector: 'app-employee-shifts',
  templateUrl: './employee-shifts.component.html',
  styleUrls: ['./employee-shifts.component.css']
})
export class EmployeeShiftsComponent implements OnInit {
  shifts: Shift[] = [];
  loading: boolean = true;
  error: string | null = null;
  
  // Calendar related properties
  currentMonth: Date = new Date();
  calendarDays: CalendarDay[] = [];
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor(private employeeProfileService: EmployeeProfileService) { }

  ngOnInit(): void {
    this.loadShifts();
  }

  loadShifts(): void {
    this.loading = true;
    this.employeeProfileService.getMyShifts().subscribe({
      next: (data) => {
        this.shifts = data;
        this.loading = false;
        this.generateCalendar();
      },
      error: (err) => {
        this.error = 'Failed to load shift information';
        this.loading = false;
        console.error('Error fetching shifts:', err);
      }
    });
  }

  // Calculate if shift is today
  isToday(dateString: string): boolean {
    const today = new Date();
    const shiftDate = new Date(dateString);
    
    return today.getDate() === shiftDate.getDate() && 
           today.getMonth() === shiftDate.getMonth() && 
           today.getFullYear() === shiftDate.getFullYear();
  }

  // Calculate if shift is upcoming (future date)
  isUpcoming(dateString: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day
    
    const shiftDate = new Date(dateString);
    shiftDate.setHours(0, 0, 0, 0);
    
    return shiftDate > today;
  }

  // Generate calendar days for current month view
  generateCalendar(): void {
    this.calendarDays = [];
    
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Add empty placeholders for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      this.calendarDays.push({ 
        date: null, 
        dayOfMonth: 0,
        isCurrentMonth: false,
        hasShift: false,
        isToday: false,
        shift: null
      });
    }
    
    // Add days of the current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = this.formatDate(date);
      
      // Find if there's a shift on this day
      const shiftsOnDay = this.shifts.filter(shift => 
        this.formatDate(new Date(shift.date)) === dateStr
      );
      
      const isToday = this.isCurrentDate(date);
      
      this.calendarDays.push({
        date: date,
        dayOfMonth: day,
        isCurrentMonth: true,
        hasShift: shiftsOnDay.length > 0,
        isToday: isToday,
        shift: shiftsOnDay.length > 0 ? shiftsOnDay[0] : null
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
          shift: null
        });
      }
    }
  }
  
  // Format date to YYYY-MM-DD for comparison
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Check if date is current date
  isCurrentDate(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  }
  
  // Navigate to previous month
  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }
  
  // Navigate to next month
  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }
  
  // Get current month and year display
  get currentMonthYear(): string {
    return `${this.monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
  }
}

// Helper interface for calendar day
interface CalendarDay {
  date: Date | null;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  hasShift: boolean;
  isToday: boolean;
  shift: Shift | null;
}