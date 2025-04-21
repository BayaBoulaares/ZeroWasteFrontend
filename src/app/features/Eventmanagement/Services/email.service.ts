import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Event } from '../Entities/event';
import { BASE_URL } from 'src/consts';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:3001/api/email';

  constructor(private http: HttpClient) {}

  async sendEventRegistrationEmail(email: string, event: Event, qrCodeData: string): Promise<void> {
    if (!email || !event || !qrCodeData) {
      throw new Error('Missing required parameters for email sending');
    }

    try {
      console.log('Preparing email data...');
      const formattedStartDate = new Date(event.startDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const formattedEndDate = new Date(event.endDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Ensure QR code data is properly formatted
      const cleanQrCodeData = qrCodeData.replace(/^data:image\/png;base64,/, '');

      const emailData = {
        to: email,
        subject: `Your Registration Confirmation for ${event.title}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Event Registration Confirmation</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #2c3e50; text-align: center; margin-bottom: 20px;">Event Registration Confirmation</h2>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #3498db; margin-top: 0;">${event.title}</h3>
                <p style="color: #666;">${event.description}</p>
                
                <div style="margin: 15px 0;">
                  <h4 style="color: #2c3e50; margin-bottom: 10px;">Event Details</h4>
                  <p><strong>Start Date:</strong> ${formattedStartDate}</p>
                  <p><strong>End Date:</strong> ${formattedEndDate}</p>
                  ${event.menu ? `
                    <p><strong>Menu:</strong> ${event.menu.name}</p>
                    <p><strong>Price:</strong> $${event.menu.price}</p>
                    ${event.valeurRemise > 0 ? `
                      <p><strong>Discount:</strong> ${event.valeurRemise}%</p>
                      <p><strong>Final Price:</strong> $${event.menu.price - (event.menu.price * event.valeurRemise / 100)}</p>
                    ` : ''}
                  ` : ''}
                </div>
              </div>

              <div style="text-align: center; margin: 20px 0;">
                <h4 style="color: #2c3e50;">Your QR Code Ticket</h4>
                <img src="cid:qrcode" alt="QR Code" style="max-width: 200px; height: auto; margin: 10px 0;">
                <p style="color: #666; font-size: 14px;">Please present this QR code at the event entrance</p>
              </div>
            </div>

            <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
              <p style="color: #666; font-size: 12px;">If you have any questions, please contact support@zerowaste.com</p>
            </div>
          </body>
          </html>
        `,
        qrCodeData: cleanQrCodeData
      };

      console.log('Sending email request...');
      const response = await this.http.post(`${this.apiUrl}/send`, emailData).toPromise();
      console.log('Email sent successfully:', response);
    } catch (error: any) {
      console.error('Error sending email:', error);
      const errorMessage = error.error?.message || 'Unknown error';
      const errorDetails = error.error?.details || '';
      throw new Error(`Failed to send registration email: ${errorMessage}${errorDetails ? ` - ${errorDetails}` : ''}`);
    }
  }
} 