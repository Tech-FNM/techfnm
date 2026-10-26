// Local dev API server (Vite proxies /api here). It runs the exact same handlers that
// Vercel deploys from /api, so local and production behaviour can't drift apart.
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sendEmail from './api/send-email.js';
import sendContactEmail from './api/send-contact-email.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '100kb' }));

const PORT = process.env.PORT || 3001;

app.all('/api/send-email', sendEmail);
app.all('/api/send-contact-email', sendContactEmail);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
