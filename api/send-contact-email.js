import { applyCors, readBody, field, text, isEmail, sendMail } from './_lib/mail.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  const b = readBody(req);
  const name = field(b.name, 120);
  const email = field(b.email, 200);
  const phone = field(b.phone, 60);
  const subject = field(b.subject, 150) || 'General Inquiry';
  const message = text(b.message);

  if (!name || !isEmail(email) || !message) {
    return res.status(400).json({ success: false, error: 'Please provide your name, a valid email and a message.' });
  }

  try {
    const info = await sendMail({
      replyTo: email,
      subject: `New Contact Form Submission: ${subject} - TechFNM`,
      body: [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone || 'N/A'}`, `Subject: ${subject}`, '', 'Message:', message].join('\n'),
    });
    console.log('Contact email sent:', info.messageId);
    return res.status(200).json({ success: true, message: 'Contact email sent successfully' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return res.status(500).json({ success: false, error: 'Failed to send contact email' });
  }
}
