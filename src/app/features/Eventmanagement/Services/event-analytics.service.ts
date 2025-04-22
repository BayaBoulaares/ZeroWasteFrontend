import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Event } from '../Entities/event';
import { EventService } from './event.service';

// Interface for event performance data
export interface EventPerformance {
  eventId: number;
  eventType: string;
  discountApplied: number;
  originalPrice: number;
  ticketsSold: number;
  revenue: number;
  daysBeforeEvent: number;
  success: number; // 0-1 rating calculated based on ticket sales vs capacity
}

@Injectable({
  providedIn: 'root'
})
export class EventAnalyticsService {
  private apiUrl = 'api/event-analytics'; // Replace with your actual API endpoint
  
  // In-memory cache for performance data
  private performanceCache: EventPerformance[] = [];
  
  constructor(private http: HttpClient, private eventService: EventService) {
    // Load initial performance data
    this.loadPerformanceData();
  }
  
  /**
   * Load performance data from the API
   */
  private loadPerformanceData(): void {
    this.getPerformanceData().subscribe(data => {
      this.performanceCache = data;
    });
  }
  
  /**
   * Get performance data from the API
   * @returns Observable of event performance data
   */
  getPerformanceData(): Observable<EventPerformance[]> {
    // In a real implementation, this would fetch from your backend
    // For now, we'll use a mock implementation that generates data from existing events
    return this.http.get<Event[]>('api/events').pipe(
      map(events => this.generatePerformanceData(events)),
      catchError(error => {
        console.error('Error fetching performance data:', error);
        return of(this.getFallbackPerformanceData());
      })
    );
  }
  
  /**
   * Get all events for analysis
   * @returns Array of events with performance data
   */
  getEventsForAnalysis(): Event[] {
    // Create mock events with different cuisine types if needed
    const mockEvents: Event[] = [
      { eventid: 1001, title: 'Italian Pasta Workshop', description: 'Learn to make authentic pasta', valeurRemise: 15, Nbr: 5, menus: { price: 50 } } as Event,
      { eventid: 1002, title: 'Korean BBQ Night', description: 'Experience Korean cuisine', valeurRemise: 20, Nbr: 10, menus: { price: 75 } } as Event,
      { eventid: 1003, title: 'Mexican Fiesta', description: 'Tacos and more', valeurRemise: 25, Nbr: 15, menus: { price: 60 } } as Event,
      { eventid: 1004, title: 'French Wine Tasting', description: 'Finest French wines', valeurRemise: 10, Nbr: 20, menus: { price: 90 } } as Event,
      { eventid: 1005, title: 'Chinese Dim Sum Class', description: 'Traditional dim sum techniques', valeurRemise: 30, Nbr: 8, menus: { price: 45 } } as Event,
    ];
    
    return mockEvents;
  }
  
  /**
   * Generate performance data from events (temporary solution)
   * @param events List of events
   * @returns Generated performance data
   */
  private generatePerformanceData(events: Event[]): EventPerformance[] {
    return events.map(event => {
      // Calculate days before event
      const now = new Date();
      const startDate = new Date(event.startDate);
      const daysBeforeEvent = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Generate random ticket sales between 50-90% of capacity for past events
      const capacity = event.Nbr || 100;
      const ticketsSold = startDate < now ? Math.floor(capacity * (0.5 + Math.random() * 0.4)) : 0;
      
      // Calculate success rate based on ticket sales vs capacity
      const success = ticketsSold / capacity;
      
      // Calculate revenue
      const price = event.menus?.price || 0;
      const discountedPrice = price * (1 - (event.valeurRemise / 100));
      const revenue = ticketsSold * discountedPrice;
      
      return {
        eventId: event.eventid || 0,
        eventType: this.classifyEventType(event),
        discountApplied: event.valeurRemise,
        originalPrice: price,
        ticketsSold,
        revenue,
        daysBeforeEvent,
        success
      };
    }).filter(perf => perf.success > 0); // Only include events with some success data
  }
  
  /**
   * Fallback performance data if API fails
   * @returns Mock performance data
   */
  private getFallbackPerformanceData(): EventPerformance[] {
    return [
      { eventId: 1, eventType: 'concert', discountApplied: 25, originalPrice: 50, ticketsSold: 120, revenue: 4500, daysBeforeEvent: 2, success: 0.9 },
      { eventId: 2, eventType: 'concert', discountApplied: 35, originalPrice: 45, ticketsSold: 180, revenue: 5265, daysBeforeEvent: 1, success: 0.95 },
      { eventId: 3, eventType: 'workshop', discountApplied: 15, originalPrice: 100, ticketsSold: 50, revenue: 4250, daysBeforeEvent: 2, success: 0.8 },
      { eventId: 4, eventType: 'workshop', discountApplied: 20, originalPrice: 120, ticketsSold: 80, revenue: 7680, daysBeforeEvent: 1, success: 0.85 },
      { eventId: 5, eventType: 'conference', discountApplied: 10, originalPrice: 200, ticketsSold: 150, revenue: 27000, daysBeforeEvent: 2, success: 0.75 },
      { eventId: 6, eventType: 'conference', discountApplied: 15, originalPrice: 180, ticketsSold: 250, revenue: 38250, daysBeforeEvent: 1, success: 0.9 },
      { eventId: 7, eventType: 'exhibition', discountApplied: 20, originalPrice: 30, ticketsSold: 100, revenue: 2400, daysBeforeEvent: 2, success: 0.8 },
      { eventId: 8, eventType: 'exhibition', discountApplied: 30, originalPrice: 25, ticketsSold: 150, revenue: 2625, daysBeforeEvent: 1, success: 0.85 }
    ];
  }
  
  /**
   * Record a new event performance
   * @param performance The performance data to record
   */
  recordPerformance(performance: EventPerformance): Observable<boolean> {
    // In a real implementation, this would send to your backend
    return this.http.post<boolean>(`${this.apiUrl}`, performance).pipe(
      catchError(error => {
        console.error('Error recording performance:', error);
        // Add to local cache anyway
        this.performanceCache.push(performance);
        return of(true);
      })
    );
  }
  
  /**
   * Get similar past events based on event type and timeframe
   * @param eventType Type of event
   * @param daysBeforeEvent Days remaining before event
   * @returns List of similar past events
   */
  getSimilarEvents(eventType: string, daysBeforeEvent: number): EventPerformance[] {
    // First try to get real performance data from the cache
    const realData = this.performanceCache.filter(perf => 
      perf.eventType === eventType && 
      Math.abs(perf.daysBeforeEvent - daysBeforeEvent) <= 2
    );
    
    // If we have enough real data, use it
    if (realData.length >= 2) {
      return realData;
    }
    
    // Otherwise, generate synthetic data based on existing events
    const events = this.getEventsForAnalysis();
    const similarTypeEvents = events.filter((event: Event) => {
      const content = (event.title || '') + ' ' + (event.description || '');
      return this.classifyEventType(event) === eventType;
    });
    
    // If we have similar events, generate performance data for them
    if (similarTypeEvents.length > 0) {
      return similarTypeEvents.map((event: Event) => {
        // Calculate success based on available places
        const totalPlaces = event.Nbr + 100; // Assuming original capacity was higher
        const ticketsSold = 100; // Assume some tickets sold
        const success = (totalPlaces - event.Nbr) / totalPlaces;
        
        return {
          eventId: event.eventid || 0,
          eventType: eventType,
          discountApplied: event.valeurRemise || 10,
          originalPrice: event.menus?.price || 50,
          ticketsSold: ticketsSold,
          revenue: ticketsSold * (event.menus?.price || 50) * (1 - (event.valeurRemise || 10) / 100),
          daysBeforeEvent: daysBeforeEvent,
          success: success
        };
      });
    }
    
    // If we still don't have data, use fallback data for this event type
    return this.getFallbackPerformanceData().filter(perf => 
      perf.eventType === eventType || perf.eventType === 'international'
    );
  }
  
  /**
   * Determine the event type based on the event title and description
   * @param event The event to classify
   * @returns The classified event type (cuisine type)
   */
  private classifyEventType(event: Event): string {
    const title = event.title.toLowerCase();
    const description = event.description.toLowerCase();
    const content = title + ' ' + description;
    
    // Cuisine-based classification
    if (content.includes('chinese') || content.includes('asian') || 
        content.includes('dim sum') || content.includes('wok') || 
        content.includes('noodle')) {
      return 'chinese';
    } else if (content.includes('korean') || content.includes('kimchi') || 
               content.includes('bulgogi') || content.includes('bibimbap')) {
      return 'korean';
    } else if (content.includes('tunisian') || content.includes('couscous') || 
               content.includes('harissa') || content.includes('brik')) {
      return 'tunisian';
    } else if (content.includes('italian') || content.includes('pasta') || 
               content.includes('pizza') || content.includes('risotto') ||
               content.includes('gelato')) {
      return 'italian';
    } else if (content.includes('french') || content.includes('croissant') || 
               content.includes('baguette') || content.includes('cuisine française') ||
               content.includes('patisserie')) {
      return 'french';
    } else if (content.includes('mediterranean') || content.includes('greek') || 
               content.includes('spanish') || content.includes('tapas')) {
      return 'mediterranean';
    } else if (content.includes('indian') || content.includes('curry') || 
               content.includes('tandoori') || content.includes('masala')) {
      return 'indian';
    } else if (content.includes('japanese') || content.includes('sushi') || 
               content.includes('ramen') || content.includes('tempura')) {
      return 'japanese';
    } else if (content.includes('mexican') || content.includes('taco') || 
               content.includes('burrito') || content.includes('guacamole')) {
      return 'mexican';
    }
    
    // Default to generic cuisine type
    return 'international';
  }
}
