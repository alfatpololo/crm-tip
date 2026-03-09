'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!isSupabaseConfigured()) {
      setError('Supabase belum dikonfigurasi.');
      setLoading(false);
      return;
    }
    try {
      const { error: err } = await supabase.auth.signUp({ email: email.trim(), password });
      if (err) throw err;
      setDone(true);
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : '';
      setError(msg || 'Daftar gagal.');
    } finally {
      setLoading(false);
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md text-center">
          <h2 className="text-lg font-bold text-gray-900">Supabase belum dikonfigurasi</h2>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md text-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Cek email</h2>
          <p className="text-gray-600 text-sm mb-4">Link konfirmasi telah dikirim ke {email}. Setelah konfirmasi, gunakan tombol di bawah untuk masuk.</p>
          <Link href="/login" className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium">Ke halaman login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <Image
            src="https://static.readdy.ai/image/882211b220e3f4e1a588d98e931d4923/704ad672474b81ce928e7b53c18ecbb5.png"
            alt="TIP"
            width={80}
            height={32}
            className="h-8 w-auto"
          />
          <span className="text-xl font-bold">Daftar</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" placeholder="nama@contoh.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50">
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-500 text-center">
          Sudah punya akun? <Link href="/login" className="text-indigo-600 hover:underline">Masuk</Link>
        </p>
      </div>
    </div>
  );
}
