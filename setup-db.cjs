const { Client } = require('pg');

const connectionString = 'postgres://postgres.rpnaqrmquddupmxvvcjg:lkYHYQfUUwenW5ai@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function setup() {
  try {
    await client.connect();
    
    // 1. Modify services table
    await client.query(`
      ALTER TABLE services ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
      ALTER TABLE services ADD COLUMN IF NOT EXISTS content TEXT;
      ALTER TABLE services ADD COLUMN IF NOT EXISTS meta_title TEXT;
      ALTER TABLE services ADD COLUMN IF NOT EXISTS meta_description TEXT;
    `);
    console.log('Updated services table.');

    // 2. Create blogs table
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
    console.log('Created blogs table.');

    // 3. Create seo_settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS seo_settings (
        id TEXT PRIMARY KEY,
        title TEXT,
        description TEXT
      );
    `);
    console.log('Created seo_settings table.');

    // 4. Create pages_content table
    await client.query(`
      CREATE TABLE IF NOT EXISTS pages_content (
        id TEXT PRIMARY KEY,
        page_name TEXT NOT NULL,
        section_name TEXT NOT NULL,
        content JSONB DEFAULT '{}'::jsonb
      );
    `);
    console.log('Created pages_content table.');

    // 5. Create service_requests table
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
    console.log('Created service_requests table.');

  } catch (error) {
    console.error('Error during setup:', error);
  } finally {
    await client.end();
  }
}

setup();
