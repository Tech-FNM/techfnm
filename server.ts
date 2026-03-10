import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import { supabase } from './src/lib/supabaseServer';
import { initDb } from './src/db/init';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize database
  try {
    await initDb();
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }

  app.use(cors());
  app.use(express.json());

  // API Routes
  
  // Services
  app.get('/api/services', async (req, res) => {
    const { data, error } = await supabase.from('services').select('*').order('id');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post('/api/services', async (req, res) => {
    const { title, description, icon, color } = req.body;
    const { data, error } = await supabase
      .from('services')
      .insert([{ title, description, icon, color }])
      .select();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ id: data[0].id });
  });

  app.put('/api/services/:id', async (req, res) => {
    const { title, description, icon, color } = req.body;
    const { id } = req.params;
    const { error } = await supabase
      .from('services')
      .update({ title, description, icon, color })
      .eq('id', id);
      
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.delete('/api/services/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Projects
  app.get('/api/projects', async (req, res) => {
    const { data, error } = await supabase.from('projects').select('*').order('id');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post('/api/projects', async (req, res) => {
    const { title, category, image } = req.body;
    const { data, error } = await supabase
      .from('projects')
      .insert([{ title, category, image }])
      .select();
      
    if (error) return res.status(500).json({ error: error.message });
    res.json({ id: data[0].id });
  });

  app.put('/api/projects/:id', async (req, res) => {
    const { title, category, image } = req.body;
    const { id } = req.params;
    const { error } = await supabase
      .from('projects')
      .update({ title, category, image })
      .eq('id', id);
      
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.delete('/api/projects/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Team
  app.get('/api/team', async (req, res) => {
    const { data, error } = await supabase.from('team').select('*').order('id');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post('/api/team', async (req, res) => {
    const { name, role, image } = req.body;
    const { data, error } = await supabase
      .from('team')
      .insert([{ name, role, image }])
      .select();
      
    if (error) return res.status(500).json({ error: error.message });
    res.json({ id: data[0].id });
  });

  app.put('/api/team/:id', async (req, res) => {
    const { name, role, image } = req.body;
    const { id } = req.params;
    const { error } = await supabase
      .from('team')
      .update({ name, role, image })
      .eq('id', id);
      
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.delete('/api/team/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('team').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Testimonials
  app.get('/api/testimonials', async (req, res) => {
    const { data, error } = await supabase.from('testimonials').select('*').order('id');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  app.post('/api/testimonials', async (req, res) => {
    const { name, role, content, image } = req.body;
    const { data, error } = await supabase
      .from('testimonials')
      .insert([{ name, role, content, image }])
      .select();
      
    if (error) return res.status(500).json({ error: error.message });
    res.json({ id: data[0].id });
  });

  app.put('/api/testimonials/:id', async (req, res) => {
    const { name, role, content, image } = req.body;
    const { id } = req.params;
    const { error } = await supabase
      .from('testimonials')
      .update({ name, role, content, image })
      .eq('id', id);
      
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  app.delete('/api/testimonials/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // Stats
  app.get('/api/stats', async (req, res) => {
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
