import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../../Services/event.service';
import { AiDiscountService } from '../../../../Services/ai-discount.service';
import { Event } from '../../../../Entities/event';
import { BASE_URL } from 'src/consts';

@Component({
  selector: 'app-eventback',
  templateUrl: './eventback.component.html',
  styleUrls: ['./eventback.component.css']
})
export class EventbackComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading: boolean = true;
  error: string | null = null;
  readonly base_url = BASE_URL;
  searchQuery: string = '';

  constructor(
    private eventService: EventService,
    private aiDiscountService: AiDiscountService,
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
        this.filteredEvents = [...this.events];
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
    return this.aiDiscountService.calculateDiscountedPrice(originalPrice, discountPercentage);
  }

  // Get AI discount information for an event
  getAiDiscountInfo(event: Event) {
    return this.aiDiscountService.getDiscountInfo(event);
  }
  
  // Check if event has AI-powered discount
  hasAiDiscount(event: Event): boolean {
    const discountInfo = this.getAiDiscountInfo(event);
    return discountInfo.isAiDiscounted;
  }

  // Filter events based on search query
  filterEvents(): void {
    if (!this.searchQuery.trim()) {
      this.filteredEvents = [...this.events];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredEvents = this.events.filter(event => {
      const title = (event.title || '').toLowerCase();
      const description = (event.description || '').toLowerCase();
      const content = title + ' ' + description;
      
      // Check for cuisine types in the search query
      const cuisineTypes = [
        'chinese', 'korean', 'tunisian', 'italian', 'french',
        'mediterranean', 'indian', 'japanese', 'mexican', 'international'
      ];
      
      // If the query matches a cuisine type and the event content contains that cuisine
      for (const cuisine of cuisineTypes) {
        if (query.includes(cuisine) && content.includes(cuisine)) {
          return true;
        }
      }
      
      // General text search
      return title.includes(query) || description.includes(query);
    });
  }

  // Handle voice search query
  handleVoiceSearch(query: string): void {
    this.searchQuery = query;
    this.filterEvents();
  }
}
