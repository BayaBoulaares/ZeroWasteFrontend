import { Component, OnInit } from '@angular/core';
import { BASE_URL } from 'src/consts';
import { EventService } from '../../../Services/event.service';
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
  searchTerm: string = '';
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private eventService: EventService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getEvents().subscribe({
      next: (data) => {
        this.events = data;
        this.categorizeEvents();
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
    const now = new Date();
    this.upcomingEvents = this.events.filter(event => 
      new Date(event.startDate) > now
    ).sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    this.currentEvents = this.events.filter(event => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      return startDate <= now && endDate >= now;
    }).sort((a, b) => 
      new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
    );
  }

  searchEvents(): void {
    if (!this.searchTerm.trim()) {
      this.loadEvents();
      return;
    }

    this.eventService.searchEvents(this.searchTerm).subscribe({
      next: (events: Event[]) => {
        this.events = events;
        this.categorizeEvents();
      },
      error: (error: any) => {
        console.error('Error searching events:', error);
        this.error = 'Failed to search events';
      }
    });
  }

  calculateDaysLeft(endDateString: string): number {
    const today = new Date();
    const end = new Date(endDateString);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getPriceDisplay(event: Event): {
    original: string;
    discounted: string;
    savings: string;
    hasDiscount: boolean;
    discountPercentage: string;
    menuName: string;
  } {
    const menu = event.menus;
    const original = menu?.price || 0;
    const menuName = menu?.name || 'No menu selected';
    const discount = event.valeurRemise || 0;
    
    const discounted = this.calculateDiscountedPrice(original, discount);
    const savings = original - discounted;

    return {
      original: original.toFixed(2),
      discounted: discounted.toFixed(2),
      savings: savings.toFixed(2),
      hasDiscount: discount > 0,
      discountPercentage: discount.toFixed(0),
      menuName: menuName
    };
  }

  calculateDiscountedPrice(price: number, discount: number): number {
    if (!price || price <= 0) return 0;
    if (!discount || discount <= 0) return price;
    return price - (price * discount / 100);
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

  registerForEvent(event: Event): void {
    // Don't open modal if no places available
    if (event.Nbr <= 0) {
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