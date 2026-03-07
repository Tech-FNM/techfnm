import Database from 'better-sqlite3';

const db = new Database('database.sqlite');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    image TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS team (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    image TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT NOT NULL
  );
`);

// Seed data if empty
const servicesCount = db.prepare('SELECT count(*) as count FROM services').get() as { count: number };

if (servicesCount.count === 0) {
  const insertService = db.prepare('INSERT INTO services (title, description, icon, color) VALUES (?, ?, ?, ?)');
  const services = [
    {
      title: 'Digital Marketing',
      description: 'Aliquam vel felis elit. Phasellus vitae laoreet mauris. Nullam at cursus odio. Suspendisse semper magna ve...',
      icon: 'Share2',
      color: 'bg-blue-900/20 text-blue-400',
    },
    {
      title: 'Content Writing',
      description: 'Aliquam vel felis elit. Phasellus vitae laoreet mauris. Nullam at cursus odio. Suspendisse semper magna ve...',
      icon: 'PenTool',
      color: 'bg-purple-900/20 text-purple-400',
    },
    {
      title: 'Ecommerce',
      description: 'Aliquam vel felis elit. Phasellus vitae laoreet mauris. Nullam at cursus odio. Suspendisse semper magna ve...',
      icon: 'ShoppingCart',
      color: 'bg-green-900/20 text-green-400',
    },
    {
      title: 'Social Media',
      description: 'Aliquam vel felis elit. Phasellus vitae laoreet mauris. Nullam at cursus odio. Suspendisse semper magna ve...',
      icon: 'Globe',
      color: 'bg-orange-900/20 text-orange-400',
    },
    {
      title: 'Web Development',
      description: 'Aliquam vel felis elit. Phasellus vitae laoreet mauris. Nullam at cursus odio. Suspendisse semper magna ve...',
      icon: 'Code',
      color: 'bg-red-900/20 text-red-400',
    },
    {
      title: 'App Development',
      description: 'Aliquam vel felis elit. Phasellus vitae laoreet mauris. Nullam at cursus odio. Suspendisse semper magna ve...',
      icon: 'Smartphone',
      color: 'bg-indigo-900/20 text-indigo-400',
    },
  ];
  services.forEach(s => insertService.run(s.title, s.description, s.icon, s.color));
}

const projectsCount = db.prepare('SELECT count(*) as count FROM projects').get() as { count: number };
if (projectsCount.count === 0) {
  const insertProject = db.prepare('INSERT INTO projects (title, category, image) VALUES (?, ?, ?)');
  const projects = [
    {
      title: 'E-commerce Platform',
      category: 'Web Development',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      title: 'Mobile Banking App',
      category: 'App Development',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      title: 'Digital Marketing Campaign',
      category: 'Marketing',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      title: 'Corporate Branding',
      category: 'Branding',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      title: 'Social Media Strategy',
      category: 'Social Media',
      image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      title: 'Content Creation',
      category: 'Content',
      image: 'https://images.unsplash.com/photo-1499750310159-5b9883e73975?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
  ];
  projects.forEach(p => insertProject.run(p.title, p.category, p.image));
}

const teamCount = db.prepare('SELECT count(*) as count FROM team').get() as { count: number };
if (teamCount.count === 0) {
  const insertTeam = db.prepare('INSERT INTO team (name, role, image) VALUES (?, ?, ?)');
  const team = [
    {
      name: 'Muhammad Naeem',
      role: 'CEO',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Nabeel Ahmed',
      role: 'Web Developer',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Maroofa Mazhar',
      role: 'Graphic Designer',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Mohibba Fatima Khan',
      role: 'Web Developer',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
  ];
  team.forEach(t => insertTeam.run(t.name, t.role, t.image));
}

const testimonialsCount = db.prepare('SELECT count(*) as count FROM testimonials').get() as { count: number };
if (testimonialsCount.count === 0) {
  const insertTestimonial = db.prepare('INSERT INTO testimonials (name, role, content, image) VALUES (?, ?, ?, ?)');
  const testimonials = [
    {
      name: 'Sarah Malik',
      role: 'Business Owner',
      content: 'TechFNM built a stunning website for my business; fast, responsive, and SEO-friendly. Their communication was smooth, and everything was delivered on time.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Ahmed Raza',
      role: 'Startup Founder',
      content: 'We got our mobile app developed by TechFNM, and the results exceeded our expectations. The UI/UX was modern, and the performance was flawless. Great work!',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Fatima Khan',
      role: 'Marketing Director',
      content: 'The digital marketing strategies implemented by TechFNM have significantly increased our online visibility and lead generation. Highly recommended!',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
  ];
  testimonials.forEach(t => insertTestimonial.run(t.name, t.role, t.content, t.image));
}

export default db;
