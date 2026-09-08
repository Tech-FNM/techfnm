import React, { useEffect, useState } from 'react';
import { Shield, UserPlus, Trash2, Edit2, CheckCircle2, Lock, Mail, User, Eye, EyeOff, KeyRound } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

interface AdminUser {
  id: string | number;
  name: string;
  email: string;
  role: 'Super Admin' | 'Administrator' | 'Editor' | 'Author';
  password?: string;
  created_at: string;
}

const DEFAULT_USERS: AdminUser[] = [
  {
    id: 'user-1',
    name: 'Naeem Ur Rehman',
    email: 'naeem@techfnm.com',
    role: 'Super Admin',
    password: 'TechFNM@2026',
    created_at: new Date('2024-01-01').toISOString()
  },
  {
    id: 'user-2',
    name: 'Support Agent',
    email: 'techfnm@gmail.com',
    role: 'Administrator',
    password: 'TechFNM@2026',
    created_at: new Date('2024-02-15').toISOString()
  },
  {
    id: 'user-3',
    name: 'Main Admin',
    email: 'admin@techfnm.com',
    role: 'Super Admin',
    password: 'TechFNM@2026',
    created_at: new Date('2023-11-01').toISOString()
  }
];

export default function UserManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Administrator' as AdminUser['role'],
    password: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // 1. Try LocalStorage
      const local = localStorage.getItem('techfnm_admin_users');
      let initialList: AdminUser[] = [];
      if (local) {
        try {
          initialList = JSON.parse(local);
        } catch {
          initialList = DEFAULT_USERS;
        }
      } else {
        initialList = DEFAULT_USERS;
        localStorage.setItem('techfnm_admin_users', JSON.stringify(DEFAULT_USERS));
      }

      // 2. Try Supabase profiles
      try {
        const { data, error } = await supabase.from('profiles').select('*');
        if (data && data.length > 0) {
          // Merge profiles
          const merged = [...initialList];
          data.forEach(remote => {
            if (!merged.some(u => u.email.toLowerCase() === remote.email?.toLowerCase())) {
              merged.push({
                id: remote.id,
                name: remote.full_name || remote.name || remote.email.split('@')[0],
                email: remote.email,
                role: remote.role || 'Administrator',
                password: 'TechFNM@2026',
                created_at: remote.created_at || new Date().toISOString()
              });
            }
          });
          initialList = merged;
          localStorage.setItem('techfnm_admin_users', JSON.stringify(merged));
        }
      } catch (err) {
        // silent fallback
      }

      setUsers(initialList);
    } catch (e) {
      setUsers(DEFAULT_USERS);
    } finally {
      setLoading(false);
    }
  };

  const saveUsersList = (updated: AdminUser[]) => {
    setUsers(updated);
    localStorage.setItem('techfnm_admin_users', JSON.stringify(updated));
  };

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password || 'TechFNM@2026'
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'Administrator',
      password: 'TechFNM@2026'
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please enter name and valid email.');
      return;
    }

    try {
      let updated: AdminUser[];
      if (selectedUser) {
        // Edit existing user
        updated = users.map(u => u.id === selectedUser.id ? {
          ...u,
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          password: formData.password ? formData.password.trim() : u.password
        } : u);
        toast.success(`User "${formData.name}" updated successfully!`);
      } else {
        // Create new user
        if (users.some(u => u.email.toLowerCase() === formData.email.trim().toLowerCase())) {
          toast.error('A user with this email address already exists.');
          return;
        }

        const newUser: AdminUser = {
          id: `user-${Date.now()}`,
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          password: formData.password ? formData.password.trim() : 'TechFNM@2026',
          created_at: new Date().toISOString()
        };
        updated = [newUser, ...users];
        toast.success(`New user "${formData.name}" registered and authorized!`);
      }

      saveUsersList(updated);

      // Attempt Supabase sync
      try {
        await supabase.from('profiles').upsert(updated.map(u => ({
          id: typeof u.id === 'string' && u.id.startsWith('user-') ? undefined : u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          updated_at: new Date().toISOString()
        })));
      } catch {
        // LocalStorage is source of truth
      }

      setIsEditing(false);
      setSelectedUser(null);
    } catch (err: any) {
      toast.error(err.message || 'Error saving user');
    }
  };

  const handleDelete = (id: string | number, name: string) => {
    if (users.length <= 1) {
      toast.error('Cannot remove the only remaining administrative user.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete administrator "${name}"? Access will be revoked immediately.`)) return;

    const filtered = users.filter(u => u.id !== id);
    saveUsersList(filtered);
    toast.success(`User "${name}" has been deleted.`);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans text-zinc-100">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/80 pb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>User Management</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-950/40 text-red-400 border border-red-900/40 font-mono">
              {users.length} Active Accounts
            </span>
          </h2>
          <p className="text-xs text-zinc-400">
            Create, edit, and revoke administrator and editor accounts. Credentials sync with the login console.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-xs shadow-lg shadow-red-950/40 cursor-pointer"
          >
            <UserPlus size={15} />
            <span>Add New User</span>
          </button>
        )}
      </div>

      {isEditing ? (
        /* EDIT / CREATE FORM */
        <div className="bg-[#0f0f13] border border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield size={16} className="text-red-500" />
              <span>{selectedUser ? `Edit User: ${selectedUser.name}` : 'Register New User'}</span>
            </h3>
            <span className="text-xs text-zinc-500 font-mono">Instant Auth Active</span>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Naeem Ur Rehman"
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Email Address (Login ID)</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@techfnm.com"
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all"
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Role / Privileges</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 outline-none font-medium transition-all"
              >
                <option value="Super Admin">Super Admin (Full Root System Access)</option>
                <option value="Administrator">Administrator (Manage Pages, Media, Settings)</option>
                <option value="Editor">Editor (Edit Content and Blog Posts)</option>
                <option value="Author">Author (Create Posts & Submissions)</option>
              </select>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Password
                </label>
                <span className="text-[10px] text-zinc-500">Default: TechFNM@2026</span>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl pl-10 pr-10 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-2.5 rounded-xl transition-all text-xs shadow-lg shadow-red-950/40 cursor-pointer text-center"
              >
                {selectedUser ? 'Save User Changes' : 'Register User'}
              </button>
              <button
                type="button"
                onClick={() => { setIsEditing(false); setSelectedUser(null); }}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white text-xs font-semibold border border-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : loading ? (
        <div className="text-center py-20 text-zinc-500 font-mono text-sm">Loading users list...</div>
      ) : (
        /* USERS DIRECTORY TABLE */
        <div className="space-y-4">
          {/* Filter / Search bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter users by name, email, or role..."
              className="bg-[#0f0f13] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all max-w-sm"
            />
            <span className="text-xs text-zinc-500 font-mono">
              Showing {filteredUsers.length} of {users.length} accounts
            </span>
          </div>

          <div className="bg-[#0f0f13] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-[#141419] text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Email / Login</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Password</th>
                  <th className="px-5 py-3.5">Registered</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-900/50 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-red-950/40 border border-red-900/40 flex items-center justify-center text-red-400 text-xs font-bold">
                        {user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{user.name}</span>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-300 font-mono">{user.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                        user.role === 'Super Admin'
                          ? 'bg-red-950/30 text-red-400 border-red-900/40'
                          : user.role === 'Administrator'
                          ? 'bg-purple-950/30 text-purple-400 border-purple-900/40'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500 font-mono text-[11px]">
                      {user.password ? '••••••••' : 'Default (TechFNM@2026)'}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500 font-mono text-[11px]">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white text-zinc-400 p-2 rounded-lg transition-colors inline-flex cursor-pointer"
                        title="Edit User"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="bg-zinc-900 border border-zinc-800 hover:bg-red-950/30 hover:border-red-900/40 hover:text-red-400 text-zinc-500 p-2 rounded-lg transition-colors inline-flex cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
