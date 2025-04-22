import { Component, OnInit } from '@angular/core';
import { EventService } from '../../Services/event.service';
import { EventAnalyticsService } from '../../Services/event-analytics.service';
import { AiDiscountService } from '../../Services/ai-discount.service';
import { Event } from '../../Entities/event';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-event-performance-tracker',
  templateUrl: './event-performance-tracker.component.html',
  styleUrls: ['./event-performance-tracker.component.css']
})
export class EventPerformanceTrackerComponent implements OnInit {
  events: Event[] = [];
  upcomingEvents: Event[] = [];
  pastEvents: Event[] = [];
  selectedEvent: Event | null = null;
  eventCategories: {[key: string]: Event[]} = {};
  eventAnalytics: {[key: string]: any} = {};
  loading: boolean = true;
  successMessage: string = '';
  errorMessage: string = '';
  
  // Helper method to use Object.keys in the template
  objectKeys = Object.keys;
  
  constructor(
    private eventService: EventService,
    public analyticsService: EventAnalyticsService, // Changed to public for template access
    private aiDiscountService: AiDiscountService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadEvents();
  }
  
  loadEvents(): void {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
      
      // Categorize events by date
      const now = new Date();
      this.pastEvents = events.filter(event => {
        const endDate = new Date(event.endDate);
        return endDate < now;
      });
      
      this.upcomingEvents = events.filter(event => {
        const endDate = new Date(event.endDate);
        return endDate >= now;
      });
      
      // Categorize events by type
      this.categorizeEvents(events);
      
      // Calculate analytics
      this.calculateEventAnalytics(events);
      
      this.loading = false;
    });
  }
  
  categorizeEvents(events: Event[]): void {
    // Reset categories
    this.eventCategories = {};
    
    // Categorize events by type using the AI service's classification
    events.forEach(event => {
      const eventType = this.analyticsService['classifyEventType'](event);
      
      if (!this.eventCategories[eventType]) {
        this.eventCategories[eventType] = [];
      }
      
      this.eventCategories[eventType].push(event);
    });
  }
  
  calculateEventAnalytics(events: Event[]): void {
    // Reset analytics
    this.eventAnalytics = {
      totalEvents: events.length,
      upcomingEvents: this.upcomingEvents.length,
      pastEvents: this.pastEvents.length,
      averageDiscount: 0,
      averagePrice: 0,
      categoryCounts: {},
      discountDistribution: {
        low: 0,    // 0-15%
        medium: 0, // 16-30%
        high: 0    // 31%+
      },
      priceRanges: {
        budget: 0,     // $0-50
        standard: 0,   // $51-150
        premium: 0     // $151+
      },
      topDiscountedEvents: [],
      aiRecommendations: []
    };
    
    // Skip if no events
    if (events.length === 0) return;
    
    // Calculate averages and distributions
    let totalDiscount = 0;
    let totalPrice = 0;
    let validPriceCount = 0;
    
    events.forEach(event => {
      // Discount analytics
      totalDiscount += event.valeurRemise || 0;
      
      // Categorize by discount level
      const discount = event.valeurRemise || 0;
      if (discount <= 15) {
        this.eventAnalytics['discountDistribution'].low++;
      } else if (discount <= 30) {
        this.eventAnalytics['discountDistribution'].medium++;
      } else {
        this.eventAnalytics['discountDistribution'].high++;
      }
      
      // Price analytics
      const price = event.menus?.price || 0;
      if (price > 0) {
        totalPrice += price;
        validPriceCount++;
        
        // Categorize by price range
        if (price <= 50) {
          this.eventAnalytics['priceRanges'].budget++;
        } else if (price <= 150) {
          this.eventAnalytics['priceRanges'].standard++;
        } else {
          this.eventAnalytics['priceRanges'].premium++;
        }
      }
      
      // Category counts
      const eventType = this.analyticsService['classifyEventType'](event);
      if (!this.eventAnalytics['categoryCounts'][eventType]) {
        this.eventAnalytics['categoryCounts'][eventType] = 0;
      }
      this.eventAnalytics['categoryCounts'][eventType]++;
    });
    
    // Calculate averages
    this.eventAnalytics['averageDiscount'] = totalDiscount / events.length;
    if (validPriceCount > 0) {
      this.eventAnalytics['averagePrice'] = totalPrice / validPriceCount;
    }
    
    // Get top discounted events
    this.eventAnalytics['topDiscountedEvents'] = [...this.upcomingEvents]
      .sort((a, b) => {
        const discountA = this.aiDiscountService.calculateDynamicDiscount(a);
        const discountB = this.aiDiscountService.calculateDynamicDiscount(b);
        return discountB - discountA;
      })
      .slice(0, 5);
      
    // Generate AI recommendations
    this.generateAiRecommendations();
  }
  
  generateAiRecommendations(): void {
    // Generate insights based on the event data
    const recommendations = [];
    
    // Check if we have enough data for meaningful recommendations
    if (this.pastEvents.length < 3) {
      recommendations.push({
        title: 'Insufficient Historical Data',
        description: 'Add more events to improve AI discount recommendations.',
        type: 'warning'
      });
    } else {
      // Check for discount patterns
      const avgDiscount = this.eventAnalytics['averageDiscount'];
      if (avgDiscount < 10) {
        recommendations.push({
          title: 'Consider Higher Discounts',
          description: 'Your average discount is low. Consider testing higher discounts for certain event types.',
          type: 'suggestion'
        });
      } else if (avgDiscount > 30) {
        recommendations.push({
          title: 'High Average Discount',
          description: 'Your average discount is quite high. Consider more targeted discounting strategies.',
          type: 'warning'
        });
      }
      
      // Check for event type patterns
      const categories = Object.keys(this.eventCategories);
      if (categories.length === 1) {
        recommendations.push({
          title: 'Diversify Event Types',
          description: 'All your events are of the same type. Consider diversifying to reach different audiences.',
          type: 'suggestion'
        });
      }
      
      // Check price ranges
      if (this.eventAnalytics['priceRanges'].premium === 0 && this.eventAnalytics['priceRanges'].budget > 0) {
        recommendations.push({
          title: 'Consider Premium Events',
          description: 'You have mostly budget events. Consider adding premium events with higher margins.',
          type: 'suggestion'
        });
      }
    }
    
    // Add general recommendation
    recommendations.push({
      title: 'Optimize Last-Minute Discounts',
      description: 'The AI system automatically increases discounts as events approach to maximize attendance.',
      type: 'info'
    });
    
    this.eventAnalytics['aiRecommendations'] = recommendations;
  }
  
  selectEvent(event: Event): void {
    this.selectedEvent = event;
  }
  
  getEventTypeLabel(type: string): string {
    // Capitalize first letter
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
  
  getRecommendationClass(type: string): string {
    switch (type) {
      case 'warning': return 'text-warning';
      case 'suggestion': return 'text-primary';
      case 'info': return 'text-info';
      default: return 'text-muted';
    }
  }
  
  getRecommendationIcon(type: string): string {
    switch (type) {
      case 'warning': return 'bx-error';
      case 'suggestion': return 'bx-bulb';
      case 'info': return 'bx-info-circle';
      default: return 'bx-message';
    }
  }
  
  getDiscountInfo(event: Event): any {
    return this.aiDiscountService.getDiscountInfo(event);
  }
}
