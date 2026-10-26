// Shared helpers for the form-to-email endpoints (api/send-email.js, api/send-contact-email.js).
import nodemailer from 'nodemailer';

// Used only when ADMIN_EMAIL is not set
const DEFAULT_RECIPIENT = 'techfnm@gmail.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function applyCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
    return true;
  }
  return false;
}

export function readBody(req) {
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  return body && typeof body === 'object' ? body : {};
}

/** Trim, drop CR/LF (header injection in subject/reply-to) and cap length. */
export const field = (v, max = 300) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
/** Multi-line text keeps its newlines. */
export const text = (v, max = 5000) => String(v ?? '').trim().slice(0, max);
export const isEmail = (v) => EMAIL_RE.test(String(v || ''));

export async function sendMail({ replyTo, subject, body }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    throw new Error('Email service is not configured');
  }
  const port = Number(process.env.SMTP_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.ADMIN_EMAIL || DEFAULT_RECIPIENT,
    replyTo,
    subject,
    text: body,
  });
}
