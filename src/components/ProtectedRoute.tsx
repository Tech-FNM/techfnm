import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only update authentication state if the session explicitly changes
      // or if the user signs out.
      if (event === 'SIGNED_OUT' || (event as string) === 'USER_DELETED') {
        setIsAuthenticated(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setIsAuthenticated(!!session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admindash/login" replace />;
}
