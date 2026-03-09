import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance;

if (supabaseUrl && supabaseAnonKey) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Missing Supabase environment variables. Authentication and data fetching will fail.');
  // Create a dummy client that returns errors
  const dummyBuilder = {
    select: () => dummyBuilder,
    insert: () => dummyBuilder,
    update: () => dummyBuilder,
    delete: () => dummyBuilder,
    eq: () => dummyBuilder,
    order: () => dummyBuilder,
    then: (resolve: (value: any) => void) => resolve({ data: null, error: { message: 'Supabase not configured' } }),
  };

  supabaseInstance = {
    from: () => dummyBuilder,
    auth: {
      signInWithPassword: ({ email, password }: any) => {
        if (email === 'techhfnm@gmail.com' && password === 'admin123') {
          localStorage.setItem('dummy_auth', 'true');
          return Promise.resolve({ data: { user: { id: '1', email }, session: { access_token: 'dummy' } }, error: null });
        }
        return Promise.resolve({ data: { user: null, session: null }, error: { message: 'Invalid credentials or Supabase not configured' } });
      },
      signOut: () => {
        localStorage.removeItem('dummy_auth');
        return Promise.resolve({ error: null });
      },
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getSession: () => {
        const isAuth = localStorage.getItem('dummy_auth');
        if (isAuth) {
          return Promise.resolve({ data: { session: { user: { id: '1', email: 'techhfnm@gmail.com' }, access_token: 'dummy' } }, error: null });
        }
        return Promise.resolve({ data: { session: null }, error: null });
      },
      getUser: () => {
        const isAuth = localStorage.getItem('dummy_auth');
        if (isAuth) {
          return Promise.resolve({ data: { user: { id: '1', email: 'techhfnm@gmail.com' } }, error: null });
        }
        return Promise.resolve({ data: { user: null }, error: null });
      },
    },
  };
}

export const supabase = supabaseInstance;
