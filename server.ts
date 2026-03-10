import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import { supabase } from './src/lib/supabaseServer';
import { initDb } from './src/db/init';

async function startServer() {
  const app = express();
  const PORT = 3000;
  console.log('Starting server in', process.env.NODE_ENV || 'development', 'mode');

  // Initialize database in background
  initDb().catch(error => {
    console.error('Background database initialization failed:', error);
  });

  app.use(cors());
  app.use(express.json());

  // Log all API requests
  app.use('/api', (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Health check
  app.get('/api/health', async (req, res) => {
    let supabaseStatus = 'unknown';
    try {
      const { error } = await supabase.from('services').select('id').limit(1);
      supabaseStatus = error ? `error: ${error.message}` : 'ok';
    } catch (err: any) {
      supabaseStatus = `exception: ${err.message}`;
    }

    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      supabase: supabaseStatus
    });
  });

  // Auth
  app.post(['/api/login', '/api/login/'], async (req, res) => {
    console.log('Login request received:', req.body.email);
    const { email, password } = req.body;
    // For simplicity and reliability in the iframe, using a simple check.
    // In a real app, you'd check against a database or use a more secure method.
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@techfnm.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email === adminEmail && password === adminPassword) {
      res.json({ success: true, token: 'fake-jwt-token-for-demo' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // API Routes
  
  // Services
  app.get(['/api/services', '/api/services/'], async (req, res) => {
    const { data, error } = await supabase.from('services').select('*').order('id');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post(['/api/services', '/api/services/'], async (req, res) => {
    const { title, description, icon, color } = req.body;
    const { data, error } = await supabase
      .from('services')
      .insert([{ title, description, icon, color }])
      .select();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ id: data[0].id });
  });

  app.put(['/api/services/:id', '/api/services/:id/'], async (req, res) => {
    const { title, description, icon, color } = req.body;
    const { id } = req.params;
    const { error } = await supabase
      .from('services')
      .update({ title, description, icon, color })
      .eq('id', id);
      
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.delete(['/api/services/:id', '/api/services/:id/'], async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Projects
  app.get(['/api/projects', '/api/projects/'], async (req, res) => {
    const { data, error } = await supabase.from('projects').select('*').order('id');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post(['/api/projects', '/api/projects/'], async (req, res) => {
    const { title, category, image } = req.body;
    const { data, error } = await supabase
      .from('projects')
      .insert([{ title, category, image }])
      .select();
      
    if (error) return res.status(500).json({ error: error.message });
    res.json({ id: data[0].id });
  });

  app.put(['/api/projects/:id', '/api/projects/:id/'], async (req, res) => {
    const { title, category, image } = req.body;
    const { id } = req.params;
    const { error } = await supabase
      .from('projects')
      .update({ title, category, image })
      .eq('id', id);
      
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.delete(['/api/projects/:id', '/api/projects/:id/'], async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Team
  app.get(['/api/team', '/api/team/'], async (req, res) => {
    const { data, error } = await supabase.from('team').select('*').order('id');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post(['/api/team', '/api/team/'], async (req, res) => {
    const { name, role, image } = req.body;
    const { data, error } = await supabase
      .from('team')
      .insert([{ name, role, image }])
      .select();
      
    if (error) return res.status(500).json({ error: error.message });
    res.json({ id: data[0].id });
  });

  app.put(['/api/team/:id', '/api/team/:id/'], async (req, res) => {
    const { name, role, image } = req.body;
    const { id } = req.params;
    const { error } = await supabase
      .from('team')
      .update({ name, role, image })
      .eq('id', id);
      
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.delete(['/api/team/:id', '/api/team/:id/'], async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('team').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Testimonials
  app.get(['/api/testimonials', '/api/testimonials/'], async (req, res) => {
    const { data, error } = await supabase.from('testimonials').select('*').order('id');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post(['/api/testimonials', '/api/testimonials/'], async (req, res) => {
    const { name, role, content, image } = req.body;
    const { data, error } = await supabase
      .from('testimonials')
      .insert([{ name, role, content, image }])
      .select();
      
    if (error) return res.status(500).json({ error: error.message });
    res.json({ id: data[0].id });
  });

  app.put(['/api/testimonials/:id', '/api/testimonials/:id/'], async (req, res) => {
    const { name, role, content, image } = req.body;
    const { id } = req.params;
    const { error } = await supabase
      .from('testimonials')
      .update({ name, role, content, image })
      .eq('id', id);
      
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.delete(['/api/testimonials/:id', '/api/testimonials/:id/'], async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Stats
  app.get(['/api/stats', '/api/stats/'], async (req, res) => {
    try {
      const [services, projects, team, testimonials] = await Promise.all([
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('team').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
      ]);

      res.json({
        services: services.count || 0,
        projects: projects.count || 0,
        team: team.count || 0,
        testimonials: testimonials.count || 0,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Catch-all for API 404s
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static('dist'));

    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  }

  // Error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
