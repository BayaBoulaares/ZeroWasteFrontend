import { Component, OnInit } from '@angular/core';
import { EmployeeProfileService } from '../../../Services/EmployeeProfile.service';
import { TrainingSession } from '../../../Entities/training-session.model';

@Component({
  selector: 'app-employee-training',
  templateUrl: './employee-training.component.html',
  styleUrls: ['./employee-training.component.css']
})
export class EmployeeTrainingComponent implements OnInit {
  trainingSessions: TrainingSession[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private employeeProfileService: EmployeeProfileService) { }

  ngOnInit(): void {
    this.loadTrainingSessions();
  }

  loadTrainingSessions(): void {
    this.loading = true;
    this.employeeProfileService.getMyTrainingSessions().subscribe({
      next: (data) => {
        this.trainingSessions = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load training session information';
        this.loading = false;
        console.error('Error fetching training sessions:', err);
      }
    });
  }

  // Calculate if training session is upcoming (future date)
  isUpcoming(dateString: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day
    
    const trainingDate = new Date(dateString);
    trainingDate.setHours(0, 0, 0, 0);
    
    return trainingDate >= today;
  }
}