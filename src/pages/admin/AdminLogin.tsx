import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, ShieldAlert } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Check Supabase profiles table in database directly
      try {
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email.trim())
          .maybeSingle();

        if (dbProfile) {
          const validPass = dbProfile.password ? dbProfile.password === password : password === 'TechFNM@2026';
          if (validPass) {
            localStorage.setItem('techfnm_admin_token', `db_auth_${dbProfile.id}`);
            localStorage.setItem('techfnm_current_user', JSON.stringify({
              name: dbProfile.name,
              email: dbProfile.email,
              role: dbProfile.role || 'Administrator'
            }));
            navigate('/admin/dashboard');
            return;
          }
        }
      } catch (e) {
        // continue to next checks
      }

      // 2. Check local dashboard users directory (managed via UserManager)
      const rawUsers = localStorage.getItem('techfnm_admin_users');
      if (rawUsers) {
        try {
          const userList = JSON.parse(rawUsers);
          const matched = userList.find((u: any) =>
            u.email?.trim().toLowerCase() === email.trim().toLowerCase() &&
            (u.password ? u.password === password : (password === 'TechFNM@2026' || password === 'admin123'))
          );
          if (matched) {
            localStorage.setItem('techfnm_admin_token', `local_auth_${matched.id}`);
            localStorage.setItem('techfnm_current_user', JSON.stringify({
              name: matched.name,
              email: matched.email,
              role: matched.role
            }));
            navigate('/admin/dashboard');
            return;
          }
        } catch {
          // continue
        }
      }

      // 3. Hardcoded master admin fallback
      if (email.trim().toLowerCase() === 'admin@techfnm.com' && (password === 'TechFNM@2026' || password === 'admin123')) {
        localStorage.setItem('techfnm_admin_token', 'local_authorized_root');
        localStorage.setItem('techfnm_current_user', JSON.stringify({
          name: 'Naeem Ur Rehman',
          email: 'admin@techfnm.com',
          role: 'Super Admin'
        }));
        navigate('/admin/dashboard');
        return;
      }

      // 4. Try Supabase Auth service
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        localStorage.setItem('techfnm_admin_token', data.session.access_token);
        localStorage.setItem('techfnm_current_user', JSON.stringify({
          name: data.user.email?.split('@')[0] || 'Admin',
          email: data.user.email,
          role: 'Administrator'
        }));
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 font-sans text-white">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-red-900/10 blur-[80px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-red-800/10 blur-[80px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-red-600/10 text-red-500 border border-red-500/20 mb-2">
            <Lock size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">WordPress Console</h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">TechFNM Admin Log</p>
        </div>

        {errorMsg && (
          <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded-xl flex items-start gap-2.5 text-sm animate-shake">
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Admin Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-650" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@techfnm.com"
                className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl pl-12 pr-4 py-3.5 text-zinc-200 placeholder-zinc-700 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-650" size={16} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl pl-12 pr-4 py-3.5 text-zinc-200 placeholder-zinc-700 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-950/20 disabled:opacity-75"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
