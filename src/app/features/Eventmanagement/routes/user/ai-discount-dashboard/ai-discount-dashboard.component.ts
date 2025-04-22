import { Component, OnInit } from '@angular/core';
import { Event } from '../../../Entities/event';
import { EventService } from '../../../Services/event.service';
import { AiDiscountService } from '../../../Services/ai-discount.service';

@Component({
  selector: 'app-ai-discount-dashboard',
  templateUrl: './ai-discount-dashboard.component.html',
  styleUrls: ['./ai-discount-dashboard.component.css']
})
export class AiDiscountDashboardComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  loading: boolean = true;
  error: string | null = null;
  
  // Filter options
  showOnlyDiscounted: boolean = false;
  sortOption: string = 'discount'; // 'discount', 'date', 'price'
  
  constructor(
    private eventService: EventService,
    private aiDiscountService: AiDiscountService
  ) { }

  ngOnInit(): void {
    this.loadEvents();
  }
  
  loadEvents(): void {
    this.loading = true;
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.error = 'Failed to load events. Please try again later.';
        this.loading = false;
      }
    });
  }
  
  applyFilters(): void {
    // First, filter events
    let filtered = [...this.events];
    
    // Filter by discount if needed
    if (this.showOnlyDiscounted) {
      filtered = filtered.filter(event => {
        const discount = this.aiDiscountService.calculateDynamicDiscount(event);
        return discount > 0;
      });
    }
    
    // Sort events based on selected option
    switch (this.sortOption) {
      case 'discount':
        filtered.sort((a, b) => {
          const discountA = this.aiDiscountService.calculateDynamicDiscount(a);
          const discountB = this.aiDiscountService.calculateDynamicDiscount(b);
          return discountB - discountA; // Higher discount first
        });
        break;
      case 'date':
        filtered.sort((a, b) => {
          const dateA = new Date(a.startDate).getTime();
          const dateB = new Date(b.startDate).getTime();
          return dateA - dateB; // Earliest date first
        });
        break;
      case 'price':
        filtered.sort((a, b) => {
          const priceA = a.menus?.price || 0;
          const priceB = b.menus?.price || 0;
          return priceA - priceB; // Lowest price first
        });
        break;
    }
    
    this.filteredEvents = filtered;
  }
  
  toggleDiscountFilter(): void {
    this.showOnlyDiscounted = !this.showOnlyDiscounted;
    this.applyFilters();
  }
  
  changeSortOption(option: string): void {
    this.sortOption = option;
    this.applyFilters();
  }
  
  getAiDiscount(event: Event): number {
    return this.aiDiscountService.calculateDynamicDiscount(event);
  }
  
  hasAiDiscount(event: Event): boolean {
    return this.getAiDiscount(event) > 0;
  }
}
