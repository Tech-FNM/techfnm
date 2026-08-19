import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Add CORS headers for testing if needed
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

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

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.SMTP_USER,
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
    return res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false, error: 'Failed to send email' });
  }
}
