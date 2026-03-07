import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import db from './db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  
  // Services
  app.get('/api/services', (req, res) => {
    const services = db.prepare('SELECT * FROM services').all();
    res.json(services);
  });

  app.post('/api/services', (req, res) => {
    const { title, description, icon, color } = req.body;
    const stmt = db.prepare('INSERT INTO services (title, description, icon, color) VALUES (?, ?, ?, ?)');
    const info = stmt.run(title, description, icon, color);
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/services/:id', (req, res) => {
    const { title, description, icon, color } = req.body;
    const { id } = req.params;
    const stmt = db.prepare('UPDATE services SET title = ?, description = ?, icon = ?, color = ? WHERE id = ?');
    stmt.run(title, description, icon, color, id);
    res.json({ success: true });
  });

  app.delete('/api/services/:id', (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM services WHERE id = ?');
    stmt.run(id);
    res.json({ success: true });
  });

  // Projects
  app.get('/api/projects', (req, res) => {
    const projects = db.prepare('SELECT * FROM projects').all();
    res.json(projects);
  });

  app.post('/api/projects', (req, res) => {
    const { title, category, image } = req.body;
    const stmt = db.prepare('INSERT INTO projects (title, category, image) VALUES (?, ?, ?)');
    const info = stmt.run(title, category, image);
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/projects/:id', (req, res) => {
    const { title, category, image } = req.body;
    const { id } = req.params;
    const stmt = db.prepare('UPDATE projects SET title = ?, category = ?, image = ? WHERE id = ?');
    stmt.run(title, category, image, id);
    res.json({ success: true });
  });

  app.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
    stmt.run(id);
    res.json({ success: true });
  });

  // Team
  app.get('/api/team', (req, res) => {
    const team = db.prepare('SELECT * FROM team').all();
    res.json(team);
  });

  app.post('/api/team', (req, res) => {
    const { name, role, image } = req.body;
    const stmt = db.prepare('INSERT INTO team (name, role, image) VALUES (?, ?, ?)');
    const info = stmt.run(name, role, image);
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/team/:id', (req, res) => {
    const { name, role, image } = req.body;
    const { id } = req.params;
    const stmt = db.prepare('UPDATE team SET name = ?, role = ?, image = ? WHERE id = ?');
    stmt.run(name, role, image, id);
    res.json({ success: true });
  });

  app.delete('/api/team/:id', (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM team WHERE id = ?');
    stmt.run(id);
    res.json({ success: true });
  });

  // Testimonials
  app.get('/api/testimonials', (req, res) => {
    const testimonials = db.prepare('SELECT * FROM testimonials').all();
    res.json(testimonials);
  });

  app.post('/api/testimonials', (req, res) => {
    const { name, role, content, image } = req.body;
    const stmt = db.prepare('INSERT INTO testimonials (name, role, content, image) VALUES (?, ?, ?, ?)');
    const info = stmt.run(name, role, content, image);
    res.json({ id: info.lastInsertRowid });
  });

  app.put('/api/testimonials/:id', (req, res) => {
    const { name, role, content, image } = req.body;
    const { id } = req.params;
    const stmt = db.prepare('UPDATE testimonials SET name = ?, role = ?, content = ?, image = ? WHERE id = ?');
    stmt.run(name, role, content, image, id);
    res.json({ success: true });
  });

  app.delete('/api/testimonials/:id', (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM testimonials WHERE id = ?');
    stmt.run(id);
    res.json({ success: true });
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
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
