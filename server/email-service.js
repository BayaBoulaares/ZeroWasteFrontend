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
    const { to, subject, html, qrCodeData } = req.body;

    if (!to || !subject || !html || !qrCodeData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required email parameters' 
      });
    }

    // Ensure QR code data is properly formatted
    const cleanQrCodeData = qrCodeData.replace(/^data:image\/png;base64,/, '');

    const msg = {
      to,
      from: {
        email: process.env.SENDER_EMAIL,
        name: 'ZeroWaste Events'
      },
      replyTo: 'support@zerowaste.com',
      subject,
      html,
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

    console.log('Attempting to send email to:', to);
    const response = await sgMail.send(msg);
    console.log('Email sent successfully:', response);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('SendGrid API Error:', error.response.body);
    }
    res.status(500).json({ 
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