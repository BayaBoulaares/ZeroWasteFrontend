import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Event } from '../Entities/event';

const BASE_URL = 'http://localhost:8089/gaspillagezero';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${BASE_URL}/event`;

  constructor(private http: HttpClient) { }

  // Get all events
  getEvents(): Observable<Event[]> {
    return this.http.get<any[]>(`${this.apiUrl}/retrieveAllevents`).pipe(
      map((events: any[]) => {
        console.log('Raw events from backend:', events);
        
        // Log each event to see all properties
        if (events && events.length > 0) {
          console.log('First event properties:');
          for (const key in events[0]) {
            console.log(`${key}: ${events[0][key]}`);
          }
        }
        
        // Map each event to ensure Nbr property is properly set
        return events.map((event: any) => {
          // Log the Nbr property specifically
          console.log(`Event ID: ${event.eventid}, Title: ${event.title}, Nbr: ${event.nbr}`);
          
          // Create a new Event object with explicit property mapping
          const mappedEvent = {
            eventid: event.eventid,
            title: event.title,
            description: event.description,
            startDate: event.startDate,
            endDate: event.endDate,
            imagePath: event.imagePath,
            valeurRemise: event.valeurRemise,
            // Try all possible property names for Nbr
            Nbr: event.Nbr !== undefined ? event.Nbr : (event.nbr !== undefined ? event.nbr : 0),
            menus: event.menus
          } as Event;
          
          console.log('Mapped event Nbr:', mappedEvent.Nbr);
          return mappedEvent;
        });
      }),
      catchError(this.handleError)
    );
  }

  // Get event by ID
  getEventById(eventid: number): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/retieveevent/${eventid}`).pipe(
      catchError(this.handleError)
    );
  } 

  // Add new event
//  addEvent(event: Event): Observable<Event> {
  //  return this.http.post<Event>(`${this.apiUrl}/addevent`, event).pipe(
    //  catchError(this.handleError)
    //  );
  //  }

  // Update existing event
   updateEvent(event: Event): Observable<Event> {
     return this.http.put<Event>(`${this.apiUrl}/updateevent`, event).pipe(
       catchError(this.handleError)
     );
   }

  // Delete event
  deleteEvent(eventid: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteevent/${eventid}`).pipe(
      catchError(this.handleError)
    );
  }

  // Get upcoming events
  getUpcomingEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/upcoming`).pipe(
      catchError(this.handleError)
    );
  }

  // Get events with discounts
  getEventsWithDiscounts(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/discounts`).pipe(
      catchError(this.handleError)
    );
  }

  // Search events
  searchEvents(term: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/search`, {
      params: { term }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Add new event with image
  addEventWithImage(event: Event, imageFile: File): Observable<Event> {
    const formData = new FormData();
    // Add event data as separate fields
    formData.append('title', event.title);
    formData.append('description', event.description);
    formData.append('startDate', event.startDate);
    formData.append('endDate', event.endDate);
    formData.append('valeurRemise', event.valeurRemise.toString());
    formData.append('Nbr', event.Nbr.toString());
    if (event.menus) {
      if (event.menus?.menuId !== undefined) {
        formData.append('menuId', event.menus.menuId.toString());
      }
          }
    
    // Add the image file
    if (imageFile) {
      formData.append('imageFile', imageFile, imageFile.name);
    }

    return this.http.post<Event>(`${this.apiUrl}/addevent`, formData).pipe(
      catchError(this.handleError)
    );
  }

  // Update event with image
  updateEventWithImage(event: Event, imageFile: File | null): Observable<Event> {
    const formData = new FormData();
    // Add event data as separate fields
    if (event.eventid) {
      formData.append('eventid', event.eventid.toString());
    }
    formData.append('title', event.title);
    formData.append('description', event.description);
    formData.append('startDate', event.startDate);
    formData.append('endDate', event.endDate);
    formData.append('valeurRemise', event.valeurRemise.toString());
    if (event.menus) {
      if (event.menus?.menuId !== undefined) {
        formData.append('menuId', event.menus.menuId.toString());
      }
          }
    
    // Add the image file if provided
    if (imageFile) {
      formData.append('imageFile', imageFile, imageFile.name);
    }

    return this.http.put<Event>(`${this.apiUrl}/updateevent`, formData).pipe(
      catchError(this.handleError)
    );
  }

  registerViaEmailService(registrationData: any): Observable<any> {
    return this.http.post<any>('http://localhost:3001/api/email/send', registrationData).pipe(
      catchError(this.handleError)
    );
  }

  // Update available places for an event
  updateEventPlaces(event: Event): Observable<Event> {
    console.log('Updating event places in database:', event.eventid, 'New places count:', event.Nbr);
    return this.http.put<Event>(`${this.apiUrl}/updateevent`, event).pipe(
      catchError(this.handleError)
    );
  }

  // Get raw events data (for debugging)
  getRawEvents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/retrieveAllevents`).pipe(
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => error);
  }
}