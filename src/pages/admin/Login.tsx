import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      alert('Invalid password');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-zinc-800">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500"
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
