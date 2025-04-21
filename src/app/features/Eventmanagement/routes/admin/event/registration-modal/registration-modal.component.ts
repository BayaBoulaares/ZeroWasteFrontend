import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Event } from '../../../../Entities/event';
import { EmailService } from '../../../../Services/email.service';
import { QRCodeService } from '../../../../Services/qrcode.service';

@Component({
  selector: 'app-registration-modal',
  templateUrl: './registration-modal.component.html',
  styleUrls: ['./registration-modal.component.css']
})
export class RegistrationModalComponent {
  registrationForm: FormGroup;
  isLoading = false;
  qrCodeData: string | null = null;
  error: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<RegistrationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: Event },
    private fb: FormBuilder,
    private emailService: EmailService,
    private qrCodeService: QRCodeService
  ) {
    this.registrationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit() {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      this.error = null;

      try {
        console.log('Starting registration process...');
        const qrData = {
          event: {
            title: this.data.event.title,
            description: this.data.event.description,
            dates: {
              start: new Date(this.data.event.startDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              end: new Date(this.data.event.endDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            },
            price: this.data.event.menu ? {
              original: this.data.event.menu.price,
              discounted: this.calculateDiscountedPrice(this.data.event.menu.price, this.data.event.valeurRemise),
              discount: this.data.event.valeurRemise
            } : null
          },
          registration: {
            email: this.registrationForm.value.email,
            date: new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          }
        };

        console.log('Generating QR code...');
        this.qrCodeData = await this.qrCodeService.generateQRCode(JSON.stringify(qrData, null, 2));
        
        if (!this.qrCodeData) {
          throw new Error('Failed to generate QR code');
        }

        console.log('Sending registration email...');
        await this.emailService.sendEventRegistrationEmail(
          this.registrationForm.value.email,
          this.data.event,
          this.qrCodeData
        );

        console.log('Registration completed successfully');
        this.error = 'Registration successful! Please check your email (including spam folder) for your QR code ticket. The email will be sent from noreply@zerowaste.com. If you don\'t see the email within 5 minutes, please check your spam folder and contact support if needed.';
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 5000); // Give user more time to read the message
      } catch (error) {
        console.error('Registration error:', error);
        this.error = error instanceof Error ? error.message : 'Failed to complete registration. Please try again.';
      } finally {
        this.isLoading = false;
      }
    }
  }

  public calculateDiscountedPrice(price: number, discount: number): number {
    if (!price || price <= 0) return 0;
    if (!discount || discount <= 0) return price;
    return price - (price * discount / 100);
  }

  close() {
    this.dialogRef.close();
  }
} 