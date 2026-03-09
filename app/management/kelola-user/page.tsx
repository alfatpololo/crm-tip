'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import { supabase } from '@/lib/supabase/client';

const ROLES = [
  { value: 'koordinator', label: 'Koordinator' },
  { value: 'sales_officer', label: 'Sales Officer' },
  { value: 'staff', label: 'Staff' },
];

type UserRow = { id: string; email: string; role: string };

export default function KelolaUserPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [fromProfilesOnly, setFromProfilesOnly] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/admin/users', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errMsg = json?.error || json?.detail || 'Gagal memuat user';
        throw new Error(errMsg);
      }
      setUsers(Array.isArray(json.users) ? json.users : []);
      setFromProfilesOnly(!!json.fromProfilesOnly);
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Gagal memuat' });
      setUsers([]);
      setFromProfilesOnly(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateRole = async (email: string, role: string) => {
    setSaving(email);
    setMessage(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal update');
      setMessage({ type: 'success', text: `Role ${email} diubah ke ${role}.` });
      fetchUsers();
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Gagal update' });
    } finally {
      setSaving(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          variant="slate"
          title="Kelola User"
          subtitle="Atur role user (koordinator, sales officer, staff). Hanya superadmin."
          badge={{ icon: 'ri-user-settings-line', text: 'Admin' }}
        />
        {fromProfilesOnly && (
          <div className="p-4 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-sm">
            Daftar dari tabel profiles saja. Untuk daftar lengkap semua user terdaftar, isi <strong>SUPABASE_SERVICE_ROLE_KEY</strong> (bukan anon) di .env.local — Supabase Dashboard → Settings → API → service_role.
          </div>
        )}
        {message && (
          <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}
        <PageCard accent="blue" icon="ri-user-settings-line" title="Daftar User">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Memuat...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-3 px-4">{u.email}</td>
                      <td className="py-3 px-4">
                        {u.role === 'superadmin' ? (
                          <span className="font-medium text-amber-600">Superadmin</span>
                        ) : (
                          <select
                            data-email={u.email}
                            value={u.role}
                            onChange={(e) => updateRole(u.email, e.target.value)}
                            disabled={saving === u.email}
                            className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                          >
                            {ROLES.map((r) => (
                              <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {saving === u.email && <span className="text-gray-500 text-sm">Menyimpan...</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PageCard>
      </div>
    </DashboardLayout>
  );
}
