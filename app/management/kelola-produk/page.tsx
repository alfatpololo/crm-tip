'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import { supabase } from '@/lib/supabase/client';

type ProductRow = { id: string; key: string; name: string; sort_order: number };

export default function KelolaProdukPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({ key: '', name: '', sort_order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/admin/products', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (!res.ok) throw new Error('Gagal memuat produk');
      const json = await res.json();
      setProducts(Array.isArray(json.products) ? json.products : []);
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Gagal memuat' });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.key.trim() || !form.name.trim()) {
      setMessage({ type: 'error', text: 'Key dan nama wajib.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const url = editingId ? '/api/admin/products' : '/api/admin/products';
      const body = editingId
        ? { id: editingId, key: form.key.trim(), name: form.name.trim(), sort_order: form.sort_order }
        : { key: form.key.trim(), name: form.name.trim(), sort_order: form.sort_order };
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal simpan');
      setMessage({ type: 'success', text: editingId ? 'Produk diupdate.' : 'Produk ditambah.' });
      setForm({ key: '', name: '', sort_order: products.length });
      setEditingId(null);
      fetchProducts();
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Gagal simpan' });
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Hapus produk ini?')) return;
    setSaving(true);
    setMessage(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal hapus');
      }
      setMessage({ type: 'success', text: 'Produk dihapus.' });
      if (editingId === id) setEditingId(null);
      fetchProducts();
    } catch (e) {
      setMessage({ type: 'error', text: e instanceof Error ? e.message : 'Gagal hapus' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          variant="slate"
          title="Kelola Produk"
          subtitle="Tambah, edit, hapus produk (MKASIR F&B, Persewaan, Retail, DISIPLINKU, dll)."
          badge={{ icon: 'ri-box-3-line', text: 'Admin' }}
        />
        {message && (
          <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}
        <PageCard accent="blue" icon="ri-box-3-line" title={editingId ? 'Edit Produk' : 'Tambah Produk'}>
          <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Key (slug)</label>
              <input
                type="text"
                value={form.key}
                onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))}
                placeholder="mkasir_fb"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="MKASIR F&B"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value, 10) || 0 }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                {saving ? 'Menyimpan...' : editingId ? 'Update' : 'Tambah'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm({ key: '', name: '', sort_order: products.length }); }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
                  Batal
                </button>
              )}
            </div>
          </form>
        </PageCard>
        <PageCard accent="emerald" icon="ri-list-check" title="Daftar Produk">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Memuat...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Key</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Urutan</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-3 px-4">{p.key}</td>
                      <td className="py-3 px-4">{p.name}</td>
                      <td className="py-3 px-4">{p.sort_order}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <button
                          type="button"
                          onClick={() => { setEditingId(p.id); setForm({ key: p.key, name: p.name, sort_order: p.sort_order }); }}
                          className="text-indigo-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button type="button" onClick={() => deleteProduct(p.id)} disabled={saving} className="text-red-600 hover:underline disabled:opacity-50">
                          Hapus
                        </button>
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
