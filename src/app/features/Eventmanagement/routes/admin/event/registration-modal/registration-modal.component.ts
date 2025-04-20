import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Event } from '../../../../Entities/event';
import { EventService } from '../../../../Services/event.service';

@Component({
  selector: 'app-registration-modal',
  templateUrl: './registration-modal.component.html',
  styleUrls: ['./registration-modal.component.scss']
})
export class RegistrationModalComponent {
  registrationForm: FormGroup;
  availablePlaces: number;
  totalPrice: number = 0;
  ticketPrice: number = 0;
  errorMessage: string = '';
  attendees: FormArray;

  constructor(
    private dialogRef: MatDialogRef<RegistrationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: Event },
    private fb: FormBuilder,
    private eventService: EventService
  ) {
    this.availablePlaces = data.event.Nbr;
    this.ticketPrice = this.calculateTicketPrice(data.event);
    
    // Initialize form with attendees FormArray
    this.attendees = this.fb.array([]);
    
    // Initialize form with all validators
    this.registrationForm = this.fb.group({
      numberOfTickets: [1, [
        Validators.required,
        Validators.min(1),
        Validators.max(this.availablePlaces)
      ]],
      attendees: this.attendees
    });
    
    // Add initial attendee
    this.addAttendee();
    
    // Calculate total price when number of tickets changes
    this.registrationForm.get('numberOfTickets')?.valueChanges.subscribe(value => {
      this.totalPrice = value * this.ticketPrice;
      this.updateAttendeeCount(value);
    });
  }

  calculateTicketPrice(event: Event): number {
    const menuPrice = event.menus?.price || 0;
    const discount = event.valeurRemise || 0;
    return menuPrice - (menuPrice * discount / 100);
  }
  
  // Get the attendees FormArray
  get attendeesArray() {
    return this.registrationForm.get('attendees') as FormArray;
  }
  
  // Create a new attendee form group
  createAttendee(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  // Add a new attendee to the form array
  addAttendee(): void {
    this.attendeesArray.push(this.createAttendee());
  }
  
  // Update the number of attendees based on ticket count
  updateAttendeeCount(count: number): void {
    const currentCount = this.attendeesArray.length;
    
    if (count > currentCount) {
      // Add more attendee forms
      for (let i = currentCount; i < count; i++) {
        this.addAttendee();
      }
    } else if (count < currentCount) {
      // Remove excess attendee forms
      for (let i = currentCount - 1; i >= count; i--) {
        this.attendeesArray.removeAt(i);
      }
    }
  }

  onRegister(): void {
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;
      
      // Debug log the initial state
      console.log('BEFORE REGISTRATION - Event details:', {
        eventId: this.data.event.eventid,
        title: this.data.event.title,
        availablePlaces: this.data.event.Nbr,
        ticketsToBook: formData.numberOfTickets
      });
      
      // Check if there are enough places available
      if (formData.numberOfTickets > this.availablePlaces) {
        alert(`Sorry, only ${this.availablePlaces} places are available.`);
        return;
      }
      
      // Collect all attendee names for the QR code
      const attendeeNames = formData.attendees
        .map((attendee: any) => attendee.name)
        .join(', ');
      
      // Format dates for display
      const startDate = new Date(this.data.event.startDate).toLocaleDateString();
      const endDate = new Date(this.data.event.endDate).toLocaleDateString();
      
      // Generate a confirmation code
      const confirmationCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      // Generate the QR code data with comprehensive event details
      const qrData = `Dear ${attendeeNames},

You are cordially invited to "${this.data.event.title}" taking place from ${startDate} to ${endDate}.

${this.data.event.description}

${this.data.event.menus ? `We will be serving ${this.data.event.menus.name}: ${this.data.event.menus.description}` : 'No menu information is available for this event.'}

Your reservation includes ${formData.numberOfTickets} ticket(s) at ${this.ticketPrice} TND each, with a ${this.data.event.valeurRemise}% discount applied. Total price: ${this.totalPrice} TND.

Your confirmation code is: ${confirmationCode}

Please present this QR code at the event entrance for quick check-in. We look forward to seeing you there!

Warm regards,
The ZeroWaste Team`;

      // Calculate the number of tickets booked
      const ticketsBooked = formData.numberOfTickets;
      
      // Store the original places count in case we need to revert
      const originalPlaces = this.data.event.Nbr;
      
      // Calculate the new number of available places
      const newPlacesCount = Math.max(0, originalPlaces - ticketsBooked);
      
      console.log('REGISTRATION - Places calculation:', {
        eventId: this.data.event.eventid,
        title: this.data.event.title,
        ticketsBooked: ticketsBooked,
        originalPlaces: originalPlaces,
        newPlacesCount: newPlacesCount
      });
      
      // Update the event with the new places count
      this.data.event.Nbr = newPlacesCount;
      
      // Create a proper Event object to send to the server
      const updatedEvent = new Event(
        this.data.event.eventid,
        this.data.event.title,
        this.data.event.description,
        this.data.event.startDate,
        this.data.event.endDate,
        this.data.event.imagePath,
        this.data.event.valeurRemise,
        newPlacesCount,
        this.data.event.menus
      );

      console.log('Generating QR code with event data (plain text):', qrData);
      
      // Generate QR code as data URL with event details
      import('qrcode').then(QRCode => {
        // Use proper QR code options that match the library's expected types
        const qrOptions = {
          errorCorrectionLevel: 'H' as const, // High error correction for better scanning
          margin: 1,
          width: 300,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        };
        
        // Generate the QR code with the event data
        console.log('QR code generation started...');
        QRCode.toDataURL(qrData, qrOptions).then(qrCodeImage => {
          console.log('QR code successfully generated!');
          // Define the email payload with proper type
          // Use the first attendee's email as the primary recipient
          const primaryAttendee = formData.attendees[0];
          
          // Generate attendee list HTML
          let attendeesHtml = '';
          formData.attendees.forEach((attendee: any, index: number) => {
            attendeesHtml += `
              <tr>
                <td style="padding:8px; border-bottom:1px solid #eee;">${index + 1}</td>
                <td style="padding:8px; border-bottom:1px solid #eee;">${attendee.name}</td>
                <td style="padding:8px; border-bottom:1px solid #eee;">${attendee.email}</td>
              </tr>
            `;
          });
          
          const emailPayload = {
            to: primaryAttendee.email,
            subject: `🎫 Registration Confirmation for ${this.data.event.title}`,
            html: `
              <div style="font-family: Arial, sans-serif; background:#f9f9f9; padding:24px; border-radius:10px">
                <h2 style="color:#388e3c;">Thank you for registering!</h2>
                <p>Hello <b>${primaryAttendee.name}</b>,</p>
                <p>You have successfully registered for <b>${this.data.event.title}</b>.</p>
                
                <div style="background:#fff; border:1px solid #ddd; padding:15px; margin:15px 0; border-radius:5px;">
                  <h3 style="color:#388e3c; margin-top:0;">Event Details</h3>
                  <ul style="padding-left:20px;">
                    <li><b>Date:</b> ${new Date(this.data.event.startDate).toLocaleDateString()} - ${new Date(this.data.event.endDate).toLocaleDateString()}</li>
                    <li><b>Description:</b> ${this.data.event.description}</li>
                    <li><b>Tickets:</b> ${formData.numberOfTickets}</li>
                    <li><b>Price per ticket:</b> ${this.ticketPrice} TND</li>
                    <li><b>Discount applied:</b> ${this.data.event.valeurRemise}%</li>
                    <li><b>Total Price:</b> ${this.totalPrice} TND</li>
                  </ul>
                </div>
                
                <div style="background:#fff; border:1px solid #ddd; padding:15px; margin:15px 0; border-radius:5px;">
                  <h3 style="color:#388e3c; margin-top:0;">Attendees</h3>
                  <table style="width:100%; border-collapse:collapse;">
                    <thead>
                      <tr style="background:#f5f5f5;">
                        <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">#</th>
                        <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">Name</th>
                        <th style="text-align:left; padding:8px; border-bottom:2px solid #ddd;">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${attendeesHtml}
                    </tbody>
                  </table>
                </div>
                
                <p>Please present this QR code at the event:</p>
                <p style="margin-top:20px;">We look forward to seeing you there!<br/>ZeroWaste Team</p>
              </div>
            `,
            qrCodeData: qrCodeImage
          };
          
          console.log('📧 Preparing to send email with payload:', {
            to: emailPayload.to,
            subject: emailPayload.subject,
            hasQrCode: !!emailPayload.qrCodeData,
            qrCodeLength: emailPayload.qrCodeData ? emailPayload.qrCodeData.length : 0
          });
          
          // Call the service to save the registration and send email
          this.eventService.registerViaEmailService(emailPayload).subscribe({
            next: (response: any) => {
              console.log('✅ Email sent successfully:', response);
              
              // Persist the updated places count to the database
              // Make sure we're sending the event with the correct number of places
              // Create a proper Event object to ensure it has all required methods
              const eventToUpdate = new Event(
                this.data.event.eventid,
                this.data.event.title,
                this.data.event.description,
                this.data.event.startDate,
                this.data.event.endDate,
                this.data.event.imagePath,
                this.data.event.valeurRemise,
                this.data.event.Nbr,
                this.data.event.menus
              );
              
              console.log('DATABASE UPDATE - Persisting event with places count:', {
                eventId: eventToUpdate.eventid,
                title: eventToUpdate.title,
                remainingPlaces: eventToUpdate.Nbr,
                ticketsBooked: formData.numberOfTickets
              });
              
              // Use the updateEvent method instead of updateEventPlaces to ensure compatibility
              this.eventService.updateEvent(eventToUpdate).subscribe({
                next: (updatedEvent: Event) => {
                  console.log('✅ Event places updated in database:', updatedEvent);
                  
                  // Log the final state of the event
                  console.log('FINAL EVENT STATE:', {
                    eventId: this.data.event.eventid,
                    title: this.data.event.title,
                    originalPlaces: originalPlaces,
                    ticketsBooked: ticketsBooked,
                    finalPlaces: this.data.event.Nbr
                  });
                  
                  // Close the dialog and pass back success information
                  this.dialogRef.close({
                    success: true,
                    message: 'Registration successful and email sent!',
                    ticketsBooked: ticketsBooked,
                    registrationData: formData,
                    updatedEvent: updatedEvent
                  });
                },
                error: (updateError: any) => {
                  console.error('❌ Error updating event places in database:', updateError);
                  // Still close the dialog as the email was sent successfully
                  this.dialogRef.close({
                    success: true,
                    message: 'Registration successful and email sent, but event places count may not be updated in the database.',
                    ticketsBooked: ticketsBooked,
                    registrationData: formData
                  });
                }
              });
            },
            error: (error: any) => {
              this.errorMessage = 'Error processing registration.';
              console.error('❌ Error processing registration:', error);
              console.error('Error details:', error.error);
              
              // Revert the available places if registration fails
              console.log('REVERTING PLACES - Registration failed, restoring original places count');
              this.data.event.Nbr = originalPlaces;
              console.log('Places restored to:', this.data.event.Nbr);
              
              alert('Failed to register for the event. Please try again.');
            }
          });
        }).catch(error => {
          console.error('Error generating QR code:', error);
          this.errorMessage = 'Error generating QR code.';
          // Revert the available places if QR generation fails
          this.data.event.Nbr += ticketsBooked;
        });
      }).catch(error => {
        console.error('Error loading QR code library:', error);
        this.errorMessage = 'Error loading QR code library.';
        // Revert the available places if library loading fails
        this.data.event.Nbr += ticketsBooked;
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 