import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.post('/api/send-email', async (req, res) => {
  const { name, email, phone, business_name, business_website, business_type, service, seo_issues, why_choose_us, how_found, description, preferred_contact } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const recipient = process.env.ADMIN_EMAIL || 'techfnm@gmail.com';

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipient,
      replyTo: email,
      subject: `New Service Request from ${name} - TechFNM`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Business Name: ${business_name}
        Business Website: ${business_website || 'N/A'}
        Business Type: ${business_type}
        Service Requested: ${service}
        SEO Issues: ${seo_issues ? seo_issues.join(', ') : 'N/A'}
        Why Choose Us: ${why_choose_us || 'N/A'}
        How Found: ${how_found}
        Preferred Contact: ${preferred_contact}
        
        Description:
        ${description}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to send email' });
  }
});

app.post('/api/send-contact-email', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const recipient = process.env.ADMIN_EMAIL || 'techfnm@gmail.com';

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipient,
      replyTo: email,
      subject: `New Contact Form Submission: ${subject} - TechFNM`,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact email sent:', info.messageId);
    res.status(200).json({ success: true, message: 'Contact email sent successfully' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to send contact email' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
