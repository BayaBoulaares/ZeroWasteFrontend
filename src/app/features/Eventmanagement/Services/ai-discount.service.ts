import { Injectable } from '@angular/core';
import { Event } from '../Entities/event';
import { EventAnalyticsService, EventPerformance } from './event-analytics.service';

@Injectable({
  providedIn: 'root'
})
export class AiDiscountService {
  /**
   * Store the last calculated discount for each event to ensure gradual increases
   * Key: eventId, Value: {timestamp: number, discount: number}
   */
  private lastDiscounts: Map<number, {timestamp: number, discount: number}> = new Map();
  
  constructor(private eventAnalytics: EventAnalyticsService) { }

  /**
   * Calculate the total dynamic discount for an event
   * This includes the base discount plus any AI-powered additions
   * @param event The event to calculate discount for
   * @returns The total discount percentage
   */
  calculateDynamicDiscount(event: Event): number {
    if (!event || !event.startDate || !event.eventid) {
      return 0;
    }

    const now = new Date();
    const currentTimestamp = now.getTime();
    const startDate = new Date(event.startDate);
    
    // Calculate hours remaining until event (more precise than days)
    const hoursRemaining = (startDate.getTime() - currentTimestamp) / (1000 * 60 * 60);
    
    // Base discount is the original discount set by admin
    const baseDiscount = event.valeurRemise || 0;
    
    // If event is not within 48 hours, return base discount only
    if (hoursRemaining > 48 || hoursRemaining < 0) {
      return baseDiscount;
    }
    
    // Get AI recommendation based on similar events
    const recommendedDiscount = this.getRecommendedDiscount(event, hoursRemaining);
    
    // Calculate the AI discount based on hours remaining - exactly 1% per hour
    const hoursPassed = Math.floor(48 - hoursRemaining);
    const timeBasedDiscount = hoursPassed; // 1% per hour
    
    // Use the higher of the two AI discount methods
    const aiDiscount = Math.max(timeBasedDiscount, recommendedDiscount);
    
    // Calculate the final discount (base + AI-based)
    const finalDiscount = baseDiscount + aiDiscount;
    
    // Cap the discount at 80%
    return Math.min(finalDiscount, 80);
  }
  
  /**
   * Get discount explanation text
   * @param event The event
   * @returns Human-readable explanation of discount
   */
  getDiscountExplanation(event: Event): string {
    if (!event || !event.startDate) {
      return '';
    }
    
    const now = new Date();
    const startDate = new Date(event.startDate);
    const hoursRemaining = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursRemaining > 48) {
      // Event is more than 48 hours away
      return 'AI discount will activate 48 hours before event.';
    } else if (hoursRemaining <= 48 && hoursRemaining >= 0) {
      // Get both recommendation types
      const aiRecommendation = this.getRecommendedDiscount(event, hoursRemaining);
      const timeBasedDiscount = Math.floor(Math.max(0, Math.min(48 - hoursRemaining, 48)));
      
      if (aiRecommendation > timeBasedDiscount) {
        // AI recommendation is higher
        const eventType = this.getEventType(event);
        return `AI recommends ${aiRecommendation}% based on similar ${eventType} events.`;
      } else {
        // Time-based discount is higher
        return `${timeBasedDiscount}% discount based on ${Math.floor(48 - hoursRemaining)} hours remaining.`;
      }
    }
    
    return '';
  }

  /**
   * Get days remaining until event
   * @param event The event
   * @returns Number of days remaining
   */
  getDaysRemaining(event: Event): number {
    if (!event || !event.startDate) {
      return 0;
    }

    const now = new Date();
    const startDate = new Date(event.startDate);
    return Math.floor((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Get discount badge class based on discount percentage
   * @param discount The discount percentage
   * @returns CSS class for the badge
   */
  getDiscountBadgeClass(discount: number): string {
    if (discount >= 40) {
      return 'bg-danger';
    } else if (discount >= 20) {
      return 'bg-warning text-dark';
    } else {
      return 'bg-primary';
    }
  }

  /**
   * Calculate discounted price
   * @param originalPrice The original price
   * @param discountPercentage The discount percentage
   * @returns The discounted price
   */
  calculateDiscountedPrice(originalPrice: number, discountPercentage: number): number {
    if (!originalPrice || originalPrice <= 0) return 0;
    if (!discountPercentage || discountPercentage <= 0) return originalPrice;
    
    return originalPrice * (1 - discountPercentage / 100);
  }
  
  /**
   * Determine if AI discount information should be shown for an event
   * @param event The event to check
   * @returns True if AI discount information should be shown
   */
  shouldShowAiDiscount(event: Event): boolean {
    // Always show AI discounts for all events that have a price
    // This ensures consistency across all events
    if (!event || !event.menus?.price) {
      return false;
    }
    
    // Always return true for events with a price
    // This ensures all events show both base and AI discounts
    return true;
  }

  /**
   * Get complete discount information for an event
   * @param event The event
   * @returns Object with discount information
   */
  getDiscountInfo(event: Event): {
    baseDiscount: number;
    dynamicDiscount: number;
    originalPrice: number;
    discountedPrice: number;
    savings: number;
    explanation: string;
    badgeClass: string;
    daysRemaining: number;
    isAiDiscounted: boolean;
    aiOnlyDiscount: number; // Just the AI portion of the discount
    recommendationSource: string; // Source of the AI recommendation
  } {
    const baseDiscount = event.valeurRemise || 0;
    const totalDiscount = this.calculateDynamicDiscount(event);
    
    // Calculate just the AI portion of the discount
    const aiOnlyDiscount = Math.max(0, totalDiscount - baseDiscount);
    
    const originalPrice = event.menus?.price || 0;
    const discountedPrice = this.calculateDiscountedPrice(originalPrice, totalDiscount);
    const savings = originalPrice - discountedPrice;
    const explanation = this.getDiscountExplanation(event);
    const badgeClass = this.getDiscountBadgeClass(totalDiscount);
    const daysRemaining = this.getDaysRemaining(event);
    
    // Check if AI discount should be shown (for any event with a future date)
    const isAiDiscounted = this.shouldShowAiDiscount(event);
    
    // Determine the source of recommendation
    let recommendationSource = 'time-based';
    
    if (event.startDate) {
      const now = new Date();
      const startDate = new Date(event.startDate);
      const hoursRemaining = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      // Get both recommendation types
      const aiRecommendation = this.getRecommendedDiscount(event, hoursRemaining);
      const timeBasedDiscount = Math.floor(Math.max(0, Math.min(48 - hoursRemaining, 48)));
      
      // If AI recommendation is higher than time-based, set source to 'ai'
      if (aiRecommendation > timeBasedDiscount) {
        recommendationSource = 'ai';
      }
      
      if (hoursRemaining <= 48 && hoursRemaining >= 0) {
        const recommendedDiscount = this.getRecommendedDiscount(event, hoursRemaining);
        const timeBasedDiscount = Math.floor(48 - hoursRemaining);
        
        if (recommendedDiscount > timeBasedDiscount) {
          recommendationSource = 'similar-events';
        }
      }
    }

    return {
      baseDiscount,
      dynamicDiscount: totalDiscount, // This is now the total discount
      originalPrice,
      discountedPrice,
      savings,
      explanation,
      badgeClass,
      daysRemaining,
      isAiDiscounted,
      aiOnlyDiscount, // Just the AI portion for admin display
      recommendationSource // Source of the AI recommendation
    };
  }
  
  /**
   * Get the event type using the analytics service
   * @param event The event to classify
   * @returns The classified event type
   */
  private getEventType(event: Event): string {
    // Use the event analytics service to classify the event
    return this.eventAnalytics['classifyEventType'](event);
  }
  
  /**
   * Get recommended discount based on similar events
   * @param event The event to get recommendation for
   * @param hoursRemaining Hours remaining until event start
   * @returns Recommended discount percentage
   */
  private getRecommendedDiscount(event: Event, hoursRemaining: number): number {
    // Convert hours to days (rounded)
    const daysRemaining = Math.ceil(hoursRemaining / 24);
    
    // Classify the event type
    const eventType = this.getEventType(event);
    
    // Get similar events from the analytics service
    const similarEvents = this.eventAnalytics.getSimilarEvents(eventType, daysRemaining);
    
    if (similarEvents.length === 0) {
      // No similar events found, provide a minimum recommendation based on event type
      // This ensures we always show some AI recommendation even with limited data
      
      // Default minimum recommendations by cuisine type
      const minimumRecommendations: {[key: string]: number} = {
        'mexican': 15,
        'italian': 12,
        'chinese': 10,
        'korean': 18,
        'tunisian': 20,
        'french': 8,
        'mediterranean': 10,
        'indian': 15,
        'japanese': 12,
        'international': 10
      };
      
      // Return the minimum recommendation for this event type or default to 10%
      return minimumRecommendations[eventType] || 10;
    }
    
    // Sort by success rate (highest first)
    similarEvents.sort((a, b) => b.success - a.success);
    
    // Take the top 3 most successful similar events
    const topEvents = similarEvents.slice(0, Math.min(3, similarEvents.length));
    
    // Calculate weighted average discount based on success rate
    let totalWeight = 0;
    let weightedDiscountSum = 0;
    
    topEvents.forEach(perf => {
      const weight = perf.success;
      weightedDiscountSum += perf.discountApplied * weight;
      totalWeight += weight;
    });
    
    // Calculate the weighted average discount
    const recommendedDiscount = Math.round(weightedDiscountSum / totalWeight);
    
    return recommendedDiscount;
  }
}
