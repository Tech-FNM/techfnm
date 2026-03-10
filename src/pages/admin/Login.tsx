import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));

      // Simple static check since we removed the custom backend
      if (email === 'admin@techfnm.com' && password === 'admin123') {
        const fakeToken = btoa(email + ':' + Date.now());
        localStorage.setItem('admin_token', fakeToken);
        navigate('/admindash/dashboard');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-zinc-800">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Admin Login</h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          Use default credentials to access the dashboard
        </p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
              placeholder="admin@techfnm.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
              placeholder="admin123"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-semibold"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
          <p className="text-xs text-gray-400 mb-1">Default Credentials:</p>
          <p className="text-xs text-gray-500">Email: <span className="text-gray-300">admin@techfnm.com</span></p>
          <p className="text-xs text-gray-500">Password: <span className="text-gray-300">admin123</span></p>
        </div>
      </div>
    </div>
  );
}
