'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!isSupabaseConfigured()) {
      setError('Supabase belum dikonfigurasi. Set NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local');
      setLoading(false);
      return;
    }
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (err) throw err;
      // Redirect dengan full page load agar session terbaca AuthContext (hindari race condition)
      if (data?.session) {
        const target = '/';
        window.location.href = target;
        return;
      }
      router.push('/');
      router.refresh();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : '';
      setError(msg.includes('Invalid') || msg.includes('invalid') ? 'Email atau password salah.' : msg || 'Login gagal.');
    } finally {
      setLoading(false);
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-lg font-bold text-gray-900">Supabase belum dikonfigurasi</h2>
          <p className="text-gray-600 text-sm mt-2">Isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local, lalu restart server.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-800 p-8 md:p-12 flex flex-col justify-center text-white">
        <div className="max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Image
                src="https://static.readdy.ai/image/882211b220e3f4e1a588d98e931d4923/704ad672474b81ce928e7b53c18ecbb5.png"
                alt="TIP Marketing"
                width={80}
                height={32}
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <span className="text-xl font-bold">TIP Marketing</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3">Tools untuk tim marketing</h1>
          <p className="text-indigo-100 text-sm">Login dengan email & password yang sudah didaftarkan.</p>
        </div>
      </div>
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Masuk</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{error}</div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                placeholder="nama@contoh.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? <><i className="ri-loader-4-line animate-spin text-xl"></i> Memeriksa...</> : <><i className="ri-login-box-line"></i> Masuk</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
