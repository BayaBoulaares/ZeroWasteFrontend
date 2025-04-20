import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../Services/event.service';

@Component({
  selector: 'app-event-debug',
  template: `
    <div class="container mt-4">
      <h3>Event Debug Information</h3>
      <div *ngIf="loading" class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
      
      <div *ngIf="!loading && rawEvents.length > 0">
        <h4>Raw Events Data</h4>
        <div class="card mb-3" *ngFor="let event of rawEvents">
          <div class="card-body">
            <h5 class="card-title">{{ event.title }}</h5>
            <p><strong>Event ID:</strong> {{ event.eventid }}</p>
            <p><strong>Nbr property:</strong> {{ event.nbr }}</p>
            <p><strong>Nbr property (capital):</strong> {{ event.Nbr }}</p>
           
          </div>
        </div>
      </div>
      
      <div *ngIf="!loading && rawEvents.length === 0" class="alert alert-info">
        No events found.
      </div>
    </div>
  `
})
export class EventDebugComponent implements OnInit {
  rawEvents: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadRawEvents();
  }

  loadRawEvents(): void {
    this.loading = true;
    this.eventService.getRawEvents().subscribe({
      next: (data) => {
        this.rawEvents = data;
        this.loading = false;
        console.log('Raw events loaded:', this.rawEvents);
      },
      error: (err) => {
        this.error = 'Failed to load events: ' + err.message;
        this.loading = false;
        console.error('Error loading raw events:', err);
      }
    });
  }
}
