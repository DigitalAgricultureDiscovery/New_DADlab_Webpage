import React, { useState } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { api } from '../../lib/api';
import type { UserAccount } from '../../types/cms';

interface AdminLoginProps {
  labName: string;
  onSuccess: (user: UserAccount) => void;
  onNavigate: (path: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ labName, onSuccess, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submitLogin = async (loginEmail: string, loginPass: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.login(loginEmail, loginPass);
      onSuccess(res.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        <div>
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Public Website
          </button>
        </div>

        <div className="bg-white border border-[#E5E2DC] rounded-md overflow-hidden">
          <div className="bg-black px-7 py-6 border-b border-[#CFB991]/40">
            <p className="text-[11px] font-semibold tracking-widest text-[#CFB991] uppercase">
              Purdue University · CMS Portal
            </p>
            <h1 className="font-serif text-2xl font-semibold text-white mt-1">
              Laboratory Administration
            </h1>
            <p className="text-xs text-neutral-400 mt-1">{labName}</p>
          </div>

          <form onSubmit={handleFormSubmit} className="p-7 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                University Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="saraswat@purdue.edu"
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold bg-black text-[#CFB991] rounded-md hover:bg-neutral-800 disabled:opacity-50 transition-colors"
            >
              <Lock className="w-4 h-4" />
              {loading ? 'Signing In...' : 'Sign In to CMS'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};
