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
  searchTerm: string = '';
  upcomingEvents: Event[] = [];
  baseImageUrl: string = '';
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
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading events:', error);
        this.error = 'Failed to load events';
        this.isLoading = false;
      }
    });
  }

  loadUpcomingEvents(): void {
    this.eventService.getUpcomingEvents().subscribe({
      next: (data) => {
        this.upcomingEvents = data;
        console.log('Upcoming events loaded:', this.upcomingEvents);
      },
      error: (error) => {
        console.error('Error loading upcoming events:', error);
      }
    });
  }

  searchEvents(): void {
    if (!this.searchTerm.trim()) {
      this.loadEvents();
      return;
    }

    this.eventService.searchEvents(this.searchTerm).subscribe({
      next: (events: Event[]) => {
        this.events = events;
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
  } {
    const original = event.menu?.price || 0;
    const discount = event.valeurRemise || 0;
    const discounted = this.calculateDiscountedPrice(original, discount);
    const savings = original - discounted;

    return {
      original: original.toFixed(2),
      discounted: discounted.toFixed(2),
      savings: savings.toFixed(2),
      hasDiscount: discount > 0
    };
  }

  calculateDiscountedPrice(price: number, discount: number): number {
    if (!price || price <= 0) return 0;
    if (!discount || discount <= 0) return price;
    return price - (price * discount / 100);
  }
  getImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return 'assets/images/no-image.png';
    return imagePath.startsWith('http') ? imagePath 
         : `${this.base_url}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
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

  registerForEvent(event: Event): void {
    const dialogRef = this.dialog.open(RegistrationModalComponent, {
      width: '500px',
      data: { event: event },
      panelClass: 'custom-dialog-container',
      disableClose: false,
      autoFocus: true,
      position: { top: '50px' },
      hasBackdrop: true,
      backdropClass: 'custom-backdrop'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Registration completed successfully');
      }
    });
  }
}