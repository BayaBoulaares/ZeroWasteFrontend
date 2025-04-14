import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TrainingSession } from 'src/app/features/StaffManagement/Entities/training-session.model';
import { TrainingSessionService } from 'src/app/features/StaffManagement/Services/training-session.service';


@Component({
  selector: 'app-training-session-list',
  templateUrl: './training-session-list.component.html',
  styleUrls: ['./training-session-list.component.scss']
})
export class TrainingSessionListComponent implements OnInit {
  trainingSessions: TrainingSession[] = [];
  loading = true;
  error = '';
  successMessage = '';
  showAlert = false;
  alertType = 'success';

  constructor(
    private trainingSessionService: TrainingSessionService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadTrainingSessions();
    
    // Check for query params to show appropriate alerts
    this.route.queryParams.subscribe(params => {
      if (params['success'] === 'created') {
        this.showSuccessAlert('Training session added successfully!');
      } else if (params['success'] === 'updated') {
        this.showSuccessAlert('Training session updated successfully!');
      }
    });
  }

  loadTrainingSessions(): void {
    this.loading = true;
    this.trainingSessionService.getAllTrainingSessions().subscribe({
      next: (data) => {
        this.trainingSessions = data;
        this.loading = false;
      },
      error: (err) => {
        this.showErrorAlert('Failed to load training sessions. Please try again later.');
        console.error('Error loading training sessions:', err);
        this.loading = false;
      }
    });
  }

  // Format date for display
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return dateStr; // Return the original string if invalid date
      }
      return date.toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  }

  editTrainingSession(id: number): void {
    this.router.navigate(['/admin/staffmanagement/training-sessions/edit', id]);
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

  deleteTrainingSession(id: number): void {
    this.trainingSessionService.deleteTrainingSession(id).subscribe({
      next: () => {
        this.trainingSessions = this.trainingSessions.filter(session => session.idTrainingSession !== id);
        this.showSuccessAlert('Training session deleted successfully');
        this.cancelDelete(id);
      },
      error: (err) => {
        this.showErrorAlert('Failed to delete training session');
        console.error('Error deleting training session:', err);
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