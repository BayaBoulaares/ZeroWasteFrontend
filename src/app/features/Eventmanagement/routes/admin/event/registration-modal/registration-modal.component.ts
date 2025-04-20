import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private dialogRef: MatDialogRef<RegistrationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: Event },
    private fb: FormBuilder,
    @Inject(EventService) private eventService: EventService
  ) {
    this.availablePlaces = data.event.Nbr;
    this.ticketPrice = this.calculateTicketPrice(data.event);

    this.registrationForm = this.fb.group({
      numberOfTickets: [1, [
        Validators.required,
        Validators.min(1),
        Validators.max(this.availablePlaces)
      ]],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required]
    });

    // Calculate total price when number of tickets changes
    this.registrationForm.get('numberOfTickets')?.valueChanges.subscribe(value => {
      this.totalPrice = value * this.ticketPrice;
    });
  }

  calculateTicketPrice(event: Event): number {
    const menuPrice = event.menus?.price || 0;
    const discount = event.valeurRemise || 0;
    return menuPrice - (menuPrice * discount / 100);
  }

  onRegister(): void {
    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;
      const registrationData = {
        eventId: this.data.event.eventid,
        numberOfTickets: formData.numberOfTickets,
        email: formData.email,
        name: formData.name,
        totalPrice: this.totalPrice
      };

      // Update available places
      this.data.event.Nbr -= formData.numberOfTickets;

      // Here you would typically call your service to save the registration
      this.eventService.registerForEvent(registrationData).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error: Error) => {
          console.error('Error registering for event:', error);
          // Revert the available places if registration fails
          this.data.event.Nbr += formData.numberOfTickets;
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
} 