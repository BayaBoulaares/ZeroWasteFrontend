import { Component, OnInit } from '@angular/core';
import { ShiftChangeRequest } from '../../../Entities/shift-change-request.model';
import { EmployeeProfileService } from '../../../Services/EmployeeProfile.service';
import { UserService } from 'src/app/features/userManagement/Services/user.service';


@Component({
  selector: 'app-employee-shift-requests',
  templateUrl: './employee-shift-requests.component.html',
  styleUrls: ['./employee-shift-requests.component.css']
})
export class EmployeeShiftRequestsComponent implements OnInit {
  requests: ShiftChangeRequest[] = [];
  loading: boolean = true;
  error: string | null = null;
  showRejectionReason: boolean = false;
  rejectionReason: string = '';
  selectedRequestId: number | null = null;
  user: any;

  constructor(private employeeProfileService: EmployeeProfileService,private userService:UserService) { }

  ngOnInit(): void {
    this.user= this.userService.getUser();
    this.loadRequests();
  }

  loadRequests(): void {
    this.loading = true;
    this.employeeProfileService.getMyPendingShiftChangeRequests(this.user.id).subscribe({
      next: (data) => {
        this.requests = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load shift change requests.';
        this.loading = false;
        console.error('Error fetching requests:', err);
      }
    });
  }

  acceptRequest(id: number): void {
    this.employeeProfileService.respondToShiftChangeRequest(this.user.id,id, 'ACCEPT').subscribe({
      next: () => {
        this.requests = this.requests.filter(req => req.idRequest !== id);
        this.showToast('success', 'Request Accepted', 'You have accepted the shift change request. It has been added to your schedule.');
      },
      error: (err) => {
        this.showToast('error', 'Error', 'Failed to accept the request. Please try again.');
        console.error('Error accepting request:', err);
      }
    });
  }

  openRejectDialog(id: number): void {
    this.selectedRequestId = id;
    this.rejectionReason = '';
    this.showRejectionReason = true;
  }

  closeRejectDialog(): void {
    this.showRejectionReason = false;
    this.selectedRequestId = null;
  }

  rejectRequest(): void {
    if (this.selectedRequestId) {
      this.employeeProfileService.respondToShiftChangeRequest(
        this.user.id,
        this.selectedRequestId, 
        'REJECT',
        this.rejectionReason
      ).subscribe({
        next: () => {
          this.requests = this.requests.filter(req => req.idRequest !== this.selectedRequestId);
          this.showToast('success', 'Request Rejected', 'You have rejected the shift change request.');
          this.closeRejectDialog();
        },
        error: (err) => {
          this.showToast('error', 'Error', 'Failed to reject the request. Please try again.');
          console.error('Error rejecting request:', err);
        }
      });
    }
  }

  showToast(type: string, title: string, message: string): void {
    // Implement your toast notification logic here
    // This could be using a service or library like ngx-toastr
    console.log(`${type}: ${title} - ${message}`);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}