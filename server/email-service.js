const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Email endpoint
app.post('/api/email/send', async (req, res) => {
  try {
    console.log('📬 Received email request');
    console.log('Request body keys:', Object.keys(req.body));
    
    const { to, subject, html, qrCodeData } = req.body;
    
    console.log('📧 Email details:', { 
      to, 
      subject, 
      htmlLength: html?.length || 0,
      hasQrCode: !!qrCodeData,
      qrCodeDataLength: qrCodeData?.length || 0 
    });
    
    // Check if this is a simple email or one with QR code
    if (qrCodeData) {
      console.log('🖼️ Processing email with QR code');
      // Handle email with QR code
      if (!to || !subject || !html) {
        console.error('❌ Missing required parameters for QR code email');
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required email parameters' 
        });
      }

      // Ensure QR code data is properly formatted
      const cleanQrCodeData = qrCodeData.replace(/^data:image\/png;base64,/, '');
      console.log('🔄 QR code data cleaned, length:', cleanQrCodeData.length);
      
      // Log that this is a dynamically generated QR code, not a static image
      console.log('💾 QR code contains dynamic event data - not a static image');
      try {
        // Try to parse the original data that was encoded in the QR code
        // This is just for server-side validation and logging
        const originalQrData = Buffer.from(qrCodeData.split(',')[1] || '', 'base64').toString();
        console.log('📃 QR code content type:', typeof originalQrData);
        console.log('📄 QR code contains dynamic data');
      } catch (err) {
        console.log('Could not parse QR data for logging purposes:', err.message);
      }

      const msg = {
        to,
        from: {
          email: process.env.SENDER_EMAIL || process.env.SENDGRID_FROM_EMAIL,
          name: 'ZeroWaste Events'
        },
        replyTo: 'support@zerowaste.com',
        subject,
        // Modify the HTML to include the QR code image with cid reference
        html: html + `
          <div style="text-align:center; margin:20px 0; background-color:#f9f9f9; padding:20px; border-radius:10px;">
            <h3 style="color:#388e3c; margin-top:0;">Your Event QR Code</h3>
            <div style="background-color:#fff; display:inline-block; padding:15px; border:1px solid #ddd; border-radius:5px;">
              <img src="cid:qrcode" alt="Event QR Code" style="width:250px;"/>
            </div>
            <p style="font-size:16px; color:#388e3c; margin-top:15px; font-weight:bold;">Your personal invitation is embedded in this QR code</p>
            <p style="font-size:14px; color:#666; margin:5px 0;">Present this QR code at the event entrance for quick check-in</p>
            <p style="font-size:13px; color:#888;">Contains your event details, menu selection, and ticket information</p>
          </div>
        `,
        attachments: [{
          content: cleanQrCodeData,
          filename: 'qrcode.png',
          type: 'image/png',
          disposition: 'inline',
          content_id: 'qrcode'
        }],
        mail_settings: {
          sandbox_mode: {
            enable: false
          },
          bypass_list_management: {
            enable: false
          },
          spam_check: {
            enable: true,
            threshold: 5,
            post_to_url: 'https://zerowaste.com/spam-check'
          }
        },
        tracking_settings: {
          click_tracking: {
            enable: false
          },
          open_tracking: {
            enable: false
          }
        },
        headers: {
          'X-SMTPAPI': JSON.stringify({
            category: ['event_registration'],
            unique_args: {
              event_type: 'registration_confirmation'
            }
          })
        }
      };

      console.log('📤 Attempting to send email with QR code to:', to);
      console.log('Using sender email:', process.env.SENDER_EMAIL || process.env.SENDGRID_FROM_EMAIL);
      
      try {
        const response = await sgMail.send(msg);
        console.log('✅ Email with QR code sent successfully:', response);
        return res.json({ success: true, message: 'Email with QR code sent successfully' });
      } catch (sendError) {
        console.error('❌ SendGrid error:', sendError);
        if (sendError.response) {
          console.error('SendGrid API response:', sendError.response.body);
        }
        throw sendError; // Re-throw to be caught by the outer catch block
      }
    } else {
      console.log('📝 Processing simple email without QR code');
      // Handle simple email
      if (!to || !subject || !html) {
        console.error('❌ Missing required parameters for simple email');
        return res.status(400).json({ success: false, message: 'Missing required email parameters' });
      }
      
      const msg = {
        to,
        from: process.env.SENDGRID_FROM_EMAIL, // must be a verified sender
        subject,
        html
      };
      
      console.log('📤 Attempting to send simple email to:', to);
      await sgMail.send(msg);
      console.log('✅ Simple email sent successfully');
      return res.status(200).json({ success: true, message: 'Email sent successfully' });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('SendGrid API Error:', error.response.body);
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send email',
      error: error.message,
      details: error.response?.body?.errors || 'No additional details available'
    });
  }
});

app.listen(port, () => {
  console.log(`Email service running on port ${port}`);
}); 