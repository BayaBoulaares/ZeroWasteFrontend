import { Component, OnInit } from '@angular/core';
import { BASE_URL } from 'src/consts';
import { EventService } from '../../../Services/event.service';
import { AiDiscountService } from '../../../Services/ai-discount.service';
import { Event } from '../../../Entities/event';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { RegistrationModalComponent } from './registration-modal/registration-modal.component';
import { MatDialog } from '@angular/material/dialog';

interface MenuFallback {
  name: string;
  price: number;
  menuId: number;
  description: string;
  startDate: Date;
  endDate: Date;
  imagePath: string;
}

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  readonly base_url = BASE_URL;
  events: Event[] = [];
  upcomingEvents: Event[] = [];
  currentEvents: Event[] = [];
  finishedEvents: Event[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private eventService: EventService,
    private aiDiscountService: AiDiscountService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    console.log('Starting to load events from service...');
    this.eventService.getEvents().subscribe({
      next: (data) => {
        console.log('Raw events data received:', data);
        console.log('Number of events received:', data.length);
        
        if (data.length > 0) {
          console.log('First event details:', JSON.stringify(data[0]));
        }
        
        // Ensure each event has the Nbr property properly set
        this.events = data.map(event => {
          // If the event doesn't have Nbr property but has nbr, use that
          if (event.Nbr === undefined && (event as any).nbr !== undefined) {
            console.log(`Converting nbr to Nbr for event ${event.eventid}:`, (event as any).nbr);
            event.Nbr = (event as any).nbr;
          }
          return event;
        });
        
        console.log('Events after mapping:', this.events);
        this.categorizeEvents();
        console.log('Events after categorizing - Current:', this.currentEvents.length, 'Upcoming:', this.upcomingEvents.length);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.error = 'Failed to load events';
        this.isLoading = false;
      }
    });
  }

  categorizeEvents(): void {
    console.log('Categorizing events, total events:', this.events.length);
    
    if (!this.events || this.events.length === 0) {
      console.warn('No events to categorize');
      this.upcomingEvents = [];
      this.currentEvents = [];
      this.finishedEvents = [];
      return;
    }
    
    const now = new Date();
    console.log('Current date for comparison:', now);
    
    try {
      // Process upcoming events - events that haven't started yet
      this.upcomingEvents = this.events.filter(event => {
        if (!event.startDate) {
          console.warn('Event missing startDate:', event);
          return false;
        }
        
        const startDate = new Date(event.startDate);
        const isUpcoming = startDate > now;
        console.log(`Event ${event.title} startDate:`, startDate, 'Is upcoming:', isUpcoming);
        return isUpcoming;
      }).sort((a, b) => 
        // Sort by start date (earliest first)
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
      
      console.log('Upcoming events count:', this.upcomingEvents.length);
      
      // Process current events - events that have started but not ended
      this.currentEvents = this.events.filter(event => {
        if (!event.startDate || !event.endDate) {
          console.warn('Event missing startDate or endDate:', event);
          return false;
        }
        
        const startDate = new Date(event.startDate);
        const endDate = new Date(event.endDate);
        // An event is current if it has started but not ended
        const isCurrent = startDate <= now && endDate >= now;
        
        console.log(`Event ${event.title} - startDate: ${startDate}, endDate: ${endDate}, isCurrent: ${isCurrent}`);
        return isCurrent;
      }).sort((a, b) => 
        // Sort by end date (soonest ending first)
        new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
      );
      
      console.log('Current events count:', this.currentEvents.length);
      
      // Process finished events - events that have ended
      this.finishedEvents = this.events.filter(event => {
        if (!event.endDate) {
          console.warn('Event missing endDate:', event);
          return false;
        }
        
        const endDate = new Date(event.endDate);
        // An event is finished if it has ended
        const isFinished = endDate < now;
        
        console.log(`Event ${event.title} - endDate: ${endDate}, isFinished: ${isFinished}`);
        return isFinished;
      }).sort((a, b) => 
        // Sort by end date (most recently ended first)
        new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      );
      
      console.log('Finished events count:', this.finishedEvents.length);
      
      // If no events are categorized but we have events, check if they're all finished
      if (this.upcomingEvents.length === 0 && this.currentEvents.length === 0 && 
          this.finishedEvents.length === 0 && this.events.length > 0) {
        console.warn('No events were categorized despite having events. Showing all events as upcoming.');
        this.upcomingEvents = [...this.events];
      }
    } catch (error) {
      console.error('Error categorizing events:', error);
      // Fallback: show all events as upcoming
      this.upcomingEvents = [...this.events];
      this.currentEvents = [];
      this.finishedEvents = [];
    }
  }

  /**
   * Calculate Levenshtein distance between two strings
   * This measures how many single-character edits are needed to change one string into another
   */
  private levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    
    // Initialize the matrix
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    
    for (let i = 0; i <= a.length; i++) {
      matrix[0][i] = i;
    }
    
    // Fill the matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    
    return matrix[b.length][a.length];
  }
  
  /**
   * Check if two strings are similar (differ by at most maxDistance characters)
   */
  private areSimilar(a: string, b: string, maxDistance: number = 2): boolean {
    // If either string is empty, they're not similar
    if (!a || !b) return false;
    
    // If one string contains the other, they're similar
    if (a.includes(b) || b.includes(a)) return true;
    
    // For very short words, use a smaller max distance
    const actualMaxDistance = Math.min(maxDistance, Math.floor(Math.max(a.length, b.length) / 2));
    
    // Calculate Levenshtein distance
    const distance = this.levenshteinDistance(a, b);
    return distance <= actualMaxDistance;
  }
  
  /**
   * Check if any word in text is similar to any word in the search term
   */
  private hasSimilarWord(text: string, searchTerm: string): boolean {
    if (!text || !searchTerm) return false;
    
    const textWords = text.toLowerCase().split(/\s+/);
    const searchWords = searchTerm.toLowerCase().split(/\s+/);
    
    for (const searchWord of searchWords) {
      // Skip very short words (less than 3 characters)
      if (searchWord.length < 3) continue;
      
      for (const textWord of textWords) {
        // Skip very short words (less than 3 characters)
        if (textWord.length < 3) continue;
        
        if (this.areSimilar(searchWord, textWord)) {
          console.log(`Similar words found: "${searchWord}" ~ "${textWord}"`);
          return true;
        }
      }
    }
    
    return false;
  }

  searchEvents(): void {
    console.log('Searching for:', this.searchTerm);
    
    // If search term is empty, reset to all events
    if (!this.searchTerm.trim()) {
      this.filterAndCategorizeEvents(this.events);
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();
    console.log('Search term (lowercase):', searchTermLower);
    
    // First check for availability keywords
    if (searchTermLower.includes('available') || 
        searchTermLower.includes('place') || 
        searchTermLower.includes('spot') || 
        searchTermLower.includes('ticket') || 
        searchTermLower.includes('seat') || 
        searchTermLower.includes('register')) {
      
      // Filter events that have available places
      const availableEvents = this.events.filter(event => {
        const places = this.getPlaces(event);
        return places > 0;
      });
      
      this.filterAndCategorizeEvents(availableEvents);
      return;
    }
    
    // Filter events based on search term
    let filteredEvents = this.events.filter(event => {
      // Get all the searchable content from the event
      const eventContent = [
        event.title || '',
        event.description || '',
        event.menus?.name || ''
      ].join(' ').toLowerCase();
      
      // First check for exact matches
      if (eventContent.includes(searchTermLower)) {
        return true;
      }
      
      // If no exact match, check for fuzzy matches
      const searchWords = searchTermLower.split(/\s+/);
      const contentWords = eventContent.split(/\s+/);
      
      // For each search word, check if there's a similar word in the content
      for (const searchWord of searchWords) {
        // Skip very short words
        if (searchWord.length < 3) continue;
        
        for (const contentWord of contentWords) {
          // Skip very short words
          if (contentWord.length < 3) continue;
          
          // If words are similar, consider it a match
          if (this.areSimilar(searchWord, contentWord)) {
            return true;
          }
        }
      }
      
      return false;
    });

    console.log('Fuzzy search found events:', filteredEvents.length);
    this.filterAndCategorizeEvents(filteredEvents);
  }
  
  /**
   * Handle voice search query from the voice search component
   * @param query The voice search query
   */
  handleVoiceSearch(query: string): void {
    console.log('Voice search query received:', query);
    this.searchTerm = query;
    this.searchEvents();
  }
  
  /**
   * Use an alternative search term suggested in the "Did you mean" section
   * @param alternative The alternative search term to use
   */
  useAlternativeSearch(alternative: string): void {
    this.searchTerm = alternative;
    this.searchEvents();
  }
  

  
  /**
   * Filter and categorize events into upcoming and current
   * @param events The events to filter and categorize
   */
  private filterAndCategorizeEvents(events: Event[]): void {
    this.events = events;
    this.categorizeEvents();
  }

  calculateDaysLeft(dateString: string): number {
    const today = new Date();
    const targetDate = new Date(dateString);
    const diffTime = targetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  // Get days left or passed for an event
  getDaysText(event: Event): string {
    if (this.hasEventFinished(event)) {
      // For finished events, show days since it ended
      const daysPassed = Math.abs(this.calculateDaysLeft(event.endDate));
      return daysPassed === 1 ? '1 day ago' : `${daysPassed} days ago`;
    } else if (this.hasEventStarted(event)) {
      // For current events, show days until it ends
      const daysLeft = this.calculateDaysLeft(event.endDate);
      return daysLeft === 1 ? '1 day left' : `${daysLeft} days left`;
    } else {
      // For upcoming events, show days until it starts
      const daysToStart = this.calculateDaysLeft(event.startDate);
      return daysToStart === 1 ? 'Starts tomorrow' : `Starts in ${daysToStart} days`;
    }
  }

  getPriceDisplay(event: Event): {
    original: string;
    discounted: string;
    savings: string;
    hasDiscount: boolean;
    discountPercentage: string;
    menuName: string;
    isAiDiscounted: boolean;
    aiExplanation: string;
    badgeClass: string;
  } {
    const discountInfo = this.getAiDiscountInfo(event);
    const menu = event.menus;
    const menuName = menu?.name || 'No menu selected';
    
    // Calculate the total discount percentage (base + AI)
    const totalDiscount = discountInfo.dynamicDiscount;
    
    return {
      original: discountInfo.originalPrice.toFixed(2),
      discounted: discountInfo.discountedPrice.toFixed(2),
      savings: discountInfo.savings.toFixed(2),
      hasDiscount: totalDiscount > 0,
      discountPercentage: totalDiscount.toFixed(0),
      menuName: menuName,
      isAiDiscounted: discountInfo.isAiDiscounted,
      aiExplanation: discountInfo.explanation,
      badgeClass: discountInfo.badgeClass
    };
  }

  calculateDiscountedPrice(price: number, discount: number): number {
    return this.aiDiscountService.calculateDiscountedPrice(price, discount);
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
    
    // For debugging
    console.log('Image path:', path);
    console.log('Full URL:', `${this.base_url}${path}`);
    
    return `${this.base_url}${path}`;
  }

  navigateToEventDetails(eventid: number | undefined): void {
    if (eventid) {
      this.router.navigate(['/events', eventid]);
    }
  }

  deleteEvent(eventid: number | undefined) {
    if (eventid && confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(eventid).subscribe({
        next: () => {
          this.loadEvents(); // Reload the list
        },
        error: (error) => {
          console.error('Error deleting event:', error);
          this.error = 'Failed to delete event';
        }
      });
    }
  }

  // Helper method to get the number of places from an event, handling different property names
  getPlaces(event: any): number {
    // Try all possible property names and formats
    if (event.Nbr !== undefined) {
      return event.Nbr;
    } else if (event.nbr !== undefined) {
      return event.nbr;
    } else {
      // Log if we can't find the property
      console.warn('Could not find places property in event:', event);
      return 0;
    }
  }
  
  // Helper method to get the current system date for template comparison
  getSystemDate(): Date {
    return new Date();
  }
  
  // Helper method to check if an event has started
  hasEventStarted(event: Event): boolean {
    const now = new Date();
    const startDate = new Date(event.startDate);
    return startDate <= now;
  }
  
  // Helper method to check if an event has finished
  hasEventFinished(event: Event): boolean {
    const now = new Date();
    const endDate = new Date(event.endDate);
    return endDate < now;
  }
  
  // Helper method to check if an event is available for registration
  isEventAvailableForRegistration(event: Event): boolean {
    return this.getPlaces(event) > 0 && !this.hasEventStarted(event);
  }

  registerForEvent(event: Event): void {
    // Don't open modal if no places available or if the event has already started
    const now = new Date();
    const startDate = new Date(event.startDate);
    
    if (event.Nbr <= 0 || startDate <= now) {
      console.log(`Cannot register for event: ${event.title} - Places: ${event.Nbr}, Started: ${startDate <= now}`);
      return;
    }
    
    // Create a deep copy of the event to pass to the modal
    // This ensures we don't modify the original event until registration is confirmed
    const eventCopy = new Event(
      event.eventid,
      event.title,
      event.description,
      event.startDate,
      event.endDate,
      event.imagePath,
      event.valeurRemise,
      event.Nbr, // Pass the current number of places
      event.menus
    );
    
    console.log('Opening registration modal with event:', {
      eventId: eventCopy.eventid,
      title: eventCopy.title,
      availablePlaces: eventCopy.Nbr
    });
    
    const dialogRef = this.dialog.open(RegistrationModalComponent, {
      width: '500px',
      data: { event: eventCopy },
      panelClass: 'custom-dialog-container',
      disableClose: false,
      autoFocus: true,
      position: { top: '50px' },
      hasBackdrop: true,
      backdropClass: 'custom-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        console.log('Registration completed successfully');
        console.log('Registration result:', result);
        
        // Get the number of tickets booked from the result
        const ticketsBooked = result.ticketsBooked || 0;
        
        // Find the original event in our lists and update it
        const eventId = event.eventid;
        
        // Update the event in all lists with the correct places count
        this.updateEventPlacesInLists(eventId, ticketsBooked);
        
        // Show success message to user
        this.error = null; // Clear any previous errors
      }
    });
  }
  
  // Helper method to update the places count for an event in all lists
  private updateEventPlacesInLists(eventId: number | undefined, ticketsBooked: number): void {
    if (!eventId) return;
    
    // Function to update places in a list
    const updatePlacesInList = (list: Event[]) => {
      const index = list.findIndex(e => e.eventid === eventId);
      if (index !== -1) {
        const currentPlaces = this.getPlaces(list[index]);
        const newPlaces = Math.max(0, currentPlaces - ticketsBooked);
        
        console.log(`Updating event ${eventId} in list: Places ${currentPlaces} -> ${newPlaces}`);
        
        // Create a new Event object with updated places
        list[index] = new Event(
          list[index].eventid,
          list[index].title,
          list[index].description,
          list[index].startDate,
          list[index].endDate,
          list[index].imagePath,
          list[index].valeurRemise,
          newPlaces,
          list[index].menus
        );
      }
    };
    
    // Update in all lists
    updatePlacesInList(this.events);
    updatePlacesInList(this.upcomingEvents);
    updatePlacesInList(this.currentEvents);
  }
  
  // Helper method to update an event in all local lists
  private updateEventInLists(updatedEvent: Event): void {
    // Function to replace an event in a list
    const updateEventInList = (list: Event[]) => {
      const index = list.findIndex(e => e.eventid === updatedEvent.eventid);
      if (index !== -1) {
        console.log(`Updating event in list at index ${index}. Old Nbr: ${list[index].Nbr}, New Nbr: ${updatedEvent.Nbr}`);
        list[index] = updatedEvent;
      }
    };
    
    // Update in all lists
    updateEventInList(this.events);
    updateEventInList(this.upcomingEvents);
    updateEventInList(this.currentEvents);
  }
}