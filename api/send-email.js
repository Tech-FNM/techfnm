import { applyCors, readBody, field, text, isEmail, sendMail } from './_lib/mail.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  const b = readBody(req);
  const name = field(b.name, 120);
  const email = field(b.email, 200);
  const description = text(b.description);

  if (!name || !isEmail(email) || !description) {
    return res.status(400).json({ success: false, error: 'Please provide your name, a valid email and a description.' });
  }

  const seoIssues = Array.isArray(b.seo_issues) ? b.seo_issues.map((x) => field(x, 60)).filter(Boolean) : [];

  try {
    const info = await sendMail({
      replyTo: email,
      subject: `New Service Request from ${name} - TechFNM`,
      body: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${field(b.phone, 60) || 'N/A'}`,
        `Business Name: ${field(b.business_name) || 'N/A'}`,
        `Business Website: ${field(b.business_website) || 'N/A'}`,
        `Business Type: ${field(b.business_type) || 'N/A'}`,
        `Service Requested: ${field(b.service) || 'N/A'}`,
        `SEO Issues: ${seoIssues.length ? seoIssues.join(', ') : 'N/A'}`,
        `Why Choose Us: ${field(b.why_choose_us) || 'N/A'}`,
        `How Found: ${field(b.how_found) || 'N/A'}`,
        `Preferred Contact: ${field(b.preferred_contact) || 'N/A'}`,
        '',
        'Description:',
        description,
      ].join('\n'),
    });
    console.log('Email sent:', info.messageId);
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false, error: 'Failed to send email' });
  }
}
