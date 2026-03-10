import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseInstance;

if (supabaseUrl && supabaseServiceKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseServiceKey);
} else {
  console.warn('Missing Supabase environment variables for server. API routes will fail.');
  // Create a dummy client that returns success (empty data) to prevent crashes
  const dummyBuilder = {
    select: () => dummyBuilder,
    insert: () => dummyBuilder,
    update: () => dummyBuilder,
    delete: () => dummyBuilder,
    eq: () => dummyBuilder,
    order: () => dummyBuilder,
    then: (resolve: (value: any) => void) => resolve({ data: [], error: null }),
  };

  supabaseInstance = {
    from: () => dummyBuilder,
  };
}

export const supabase = supabaseInstance;
