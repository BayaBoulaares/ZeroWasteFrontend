import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../../Services/event.service';
import { Event } from '../../../../Entities/event';
import { BASE_URL } from 'src/consts';

@Component({
  selector: 'app-eventback',
  templateUrl: './eventback.component.html',
  styleUrls: ['./eventback.component.css']
})
export class EventbackComponent implements OnInit {
  events: Event[] = [];
  loading: boolean = true;
  error: string | null = null;
  readonly base_url = BASE_URL;

  constructor(
    private eventService: EventService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  getImageUrl(imagePath: string | undefined): string {
    if (!imagePath) {
      return 'https://via.placeholder.com/300x200';
    }
    // Check if the path already includes http or https
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Check if the path starts with a slash
    const path = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
    return `${this.base_url}${path}`;
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        console.log('Loaded events:', this.events);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.error = 'Failed to load events. Please try again later.';
        this.loading = false;
      }
    });
  }

  deleteEvent(id: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          console.log('Event deleted successfully');
          // Refresh the event list
          this.loadEvents();
        },
        error: (err) => {
          console.error('Error deleting event:', err);
          alert('Failed to delete event. Please try again later.');
        }
      });
    }
  }

  editEvent(id: number): void {
    this.router.navigate(['/admin/eventmanagement/events/update', id]);
  }

  addNewEvent(): void {
    this.router.navigate(['/admin/eventmanagement/events/add']);
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  // Calculate the discounted price
  calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    if (!originalPrice || originalPrice <= 0) return 0;
    if (!discountPercentage || discountPercentage <= 0) return originalPrice;
    
    const discount = (discountPercentage / 100) * originalPrice;
    return originalPrice - discount;
  }
}
