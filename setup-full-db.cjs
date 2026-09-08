const { Client } = require('pg');

const connectionString = 'postgres://postgres.rpnaqrmquddupmxvvcjg:lkYHYQfUUwenW5ai@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL Supabase successfully.');

    // 1. Check existing tables
    const tableRes = await client.query(`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
    `);
    console.log('Existing tables in public schema:', tableRes.rows.map(r => r.table_name));

    // 2. Create / ensure all required tables for full dashboard operation:
    // a) pages_content (stores section data by page/section ID)
    await client.query(`
      CREATE TABLE IF NOT EXISTS pages_content (
        id TEXT PRIMARY KEY,
        page_name TEXT NOT NULL,
        section_name TEXT NOT NULL,
        content JSONB DEFAULT '{}'::jsonb,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);

    // b) site_pages (stores all managed pages: Home, About, Services, Contact, etc.)
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_pages (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        author TEXT DEFAULT 'admin',
        status TEXT DEFAULT 'published',
        template TEXT DEFAULT 'Default Template',
        featured_image TEXT DEFAULT '',
        content TEXT DEFAULT '',
        sections_data JSONB DEFAULT '{}'::jsonb,
        is_front_page BOOLEAN DEFAULT false,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);

    // c) site_settings
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id TEXT PRIMARY KEY,
        key TEXT UNIQUE,
        value TEXT,
        content JSONB DEFAULT '{}'::jsonb,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);

    // d) profiles (for administrative users)
    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        role TEXT DEFAULT 'Administrator',
        password TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);

    // e) services
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        icon TEXT DEFAULT 'Code',
        color TEXT DEFAULT 'bg-red-500/10 text-red-500',
        image TEXT DEFAULT '',
        slug TEXT UNIQUE,
        content TEXT,
        meta_title TEXT,
        meta_description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);

    // f) projects (portfolio)
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT,
        description TEXT,
        image TEXT,
        link TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);

    // g) faqs
    await client.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);

    // h) testimonials
    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT,
        content TEXT NOT NULL,
        image TEXT,
        rating INT DEFAULT 5,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);

    // i) leadership
    await client.query(`
      CREATE TABLE IF NOT EXISTS leadership (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT,
        sub_titles TEXT,
        quote TEXT,
        bio TEXT,
        badge_text TEXT,
        image TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);

    // j) blogs / posts
    await client.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT,
        image TEXT,
        meta_title TEXT,
        meta_description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);

    // k) service_requests (leads)
    await client.query(`
      CREATE TABLE IF NOT EXISTS service_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        business_name TEXT NOT NULL,
        business_website TEXT,
        business_type TEXT NOT NULL,
        service TEXT NOT NULL,
        seo_issues JSONB DEFAULT '[]'::jsonb,
        why_choose_us TEXT,
        how_found TEXT NOT NULL,
        description TEXT NOT NULL,
        preferred_contact TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);

    console.log('All required tables checked/created.');

    // 3. Grant full permissions to anon & authenticated roles so frontend API key can read & write smoothly!
    const allTables = [
      'pages_content',
      'site_pages',
      'site_settings',
      'profiles',
      'services',
      'projects',
      'faqs',
      'testimonials',
      'leadership',
      'blogs',
      'service_requests'
    ];

    for (const t of allTables) {
      await client.query(`ALTER TABLE ${t} DISABLE ROW LEVEL SECURITY;`);
      await client.query(`GRANT ALL ON TABLE ${t} TO anon, authenticated, service_role;`);
    }
    await client.query(`GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;`);
    console.log('Disabled RLS & granted all permissions to anon, authenticated, service_role.');

    // 4. Enable Supabase Realtime for these tables
    try {
      for (const t of allTables) {
        await client.query(`
          DO $$
          BEGIN
            IF NOT EXISTS (
              SELECT 1 FROM pg_publication_tables 
              WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = '${t}'
            ) THEN
              ALTER PUBLICATION supabase_realtime ADD TABLE ${t};
            END IF;
          EXCEPTION WHEN OTHERS THEN
            NULL;
          END $$;
        `);
      }
      console.log('Added tables to supabase_realtime publication.');
    } catch (e) {
      console.warn('Realtime publication setup note:', e.message);
    }

    // 5. Seed initial profiles if empty
    const profRes = await client.query('SELECT COUNT(*) FROM profiles');
    if (parseInt(profRes.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO profiles (id, name, email, role, password) VALUES
        ('user-1', 'Naeem Ur Rehman', 'naeem@techfnm.com', 'Super Admin', 'TechFNM@2026'),
        ('user-2', 'Support Agent', 'techfnm@gmail.com', 'Administrator', 'TechFNM@2026'),
        ('user-3', 'Main Admin', 'admin@techfnm.com', 'Super Admin', 'TechFNM@2026')
        ON CONFLICT (id) DO NOTHING;
      `);
      console.log('Seeded default admin profiles.');
    }

    // 6. Seed default leadership if empty
    const leadRes = await client.query('SELECT COUNT(*) FROM leadership');
    if (parseInt(leadRes.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO leadership (name, role, sub_titles, quote, bio, badge_text, image) VALUES
        (
          'Naeem Ur Rehman',
          'Founder & CEO',
          'FULL-STACK CLOUD ARCHITECT | DIGITAL STRATEGIST',
          'TechFNM was built to engineer digital assets that convert visitors into lifelong partners.',
          'Based in Pakistan and serving global clientele, TechFNM was founded by Naeem Ur Rehman to deliver production-grade software engineering, modern web applications, and data-driven marketing.',
          'React | Next.js | Cloud Architecture',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'
        );
      `);
      console.log('Seeded leadership.');
    }

    // 7. Seed default FAQs if empty
    const faqRes = await client.query('SELECT COUNT(*) FROM faqs');
    if (parseInt(faqRes.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO faqs (question, answer) VALUES
        ('What technologies does TechFNM specialize in?', 'We specialize in modern web and mobile application development using React, Next.js, TypeScript, TailwindCSS, Node.js, Python, Supabase, PostgreSQL, and AWS cloud infrastructure.'),
        ('How long does a custom web application take to develop?', 'Typical MVP web applications take between 2 to 6 weeks, while large-scale enterprise platforms may take 8 to 12 weeks depending on feature complexity and third-party integrations.'),
        ('Do you offer ongoing post-launch support and maintenance?', 'Yes, we provide 24/7 technical monitoring, database backups, performance optimization, and regular security patching with flexible monthly SLA agreements.'),
        ('How do you handle project management and communication?', 'We follow agile sprint methodologies. You will have direct access to senior engineers via Slack, weekly live video demos, and real-time dashboard progress tracking.');
      `);
      console.log('Seeded FAQs.');
    }

    console.log('DATABASE SETUP COMPLETED SUCCESSFULLY!');
  } catch (err) {
    console.error('Database configuration error:', err);
  } finally {
    await client.end();
  }
}

main();
