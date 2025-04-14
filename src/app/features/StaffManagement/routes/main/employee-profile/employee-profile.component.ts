import { Component, OnInit } from '@angular/core';
import { EmployeeProfileService } from '../../../Services/EmployeeProfile.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.css']
})
export class EmployeeProfileComponent implements OnInit {
  activeTab: string = 'info';

  pendingRequestsCount: number = 0;

  constructor(private employeeProfileService: EmployeeProfileService) { }

  ngOnInit(): void {
    this.loadPendingRequestsCount();
    
    // Set up periodic check for new requests (every 60 seconds)
    setInterval(() => {
      this.loadPendingRequestsCount();
    }, 60000);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    
    // If navigating to requests tab, refresh the pending count
    if (tab === 'requests') {
      this.loadPendingRequestsCount();
    }
  }
  
  loadPendingRequestsCount(): void {
    this.employeeProfileService.getMyPendingShiftChangeRequests().subscribe({
      next: (data) => {
        this.pendingRequestsCount = data.length;
      },
      error: (err) => {
        console.error('Error loading pending requests count:', err);
      }
    });
  }
}