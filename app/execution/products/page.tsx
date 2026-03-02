'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const products = [
    { id: 1, name: 'MKASIR Retail', leads: 98, pipeline: 1850000000, closing: 420000000, icon: 'ri-store-2-line' },
    { id: 2, name: 'MKASIR F&B', leads: 72, pipeline: 680000000, closing: 180000000, icon: 'ri-restaurant-line' },
    { id: 3, name: 'MKASIR Persewaan', leads: 45, pipeline: 320000000, closing: 95000000, icon: 'ri-key-line' },
    { id: 4, name: 'DISIPLINKU', leads: 86, pipeline: 980000000, closing: 280000000, icon: 'ri-user-search-line' },
    { id: 5, name: 'Salespoint', leads: 41, pipeline: 520000000, closing: 165000000, icon: 'ri-shopping-cart-line' },
  ];

  const formatRupiah = (v: number) => (v >= 1e9 ? `Rp ${(v / 1e9).toFixed(1)}M` : `Rp ${(v / 1e6).toFixed(0)}Jt`);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          title="Kategori Produk"
          subtitle="Semua aktivitas untuk 2 produk: MKASIR & DISIPLINKU. Performa pipeline per kategori/varian."
          badge={{ icon: 'ri-box-3-line', text: 'Eksekusi' }}
          variant="emerald"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 w-48"
              />
            </div>
            <button className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl transition-colors flex items-center gap-2">
              <i className="ri-add-line text-lg w-5 h-5"></i>
              Tambah Produk
            </button>
          </div>
        </PageHero>

        <PageCard accent="emerald" icon="ri-store-2-line" title="Daftar Produk (MKASIR & DISIPLINKU)">
          <p className="text-sm text-gray-600 mb-4">Produk utama: MKASIR, DISIPLINKU. Varian MKASIR (Retail, F&B, Persewaan) untuk kebutuhan pipeline dan leads.</p>
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produk</th>
                <th className="text-right py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Leads</th>
                <th className="text-right py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Pipeline</th>
                <th className="text-right py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Closing</th>
                <th className="text-center py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <i className={`${p.icon} text-xl text-blue-600`}></i>
                      </div>
                      <span className="font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-semibold text-gray-900">{p.leads}</td>
                  <td className="py-4 px-4 text-right font-semibold text-gray-900">{formatRupiah(p.pipeline)}</td>
                  <td className="py-4 px-4 text-right font-semibold text-green-700">{formatRupiah(p.closing)}</td>
                  <td className="py-4 px-4 text-center">
                    <Link
                      href="/execution/leads"
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Lihat leads <i className="ri-arrow-right-line"></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </PageCard>
      </div>
    </DashboardLayout>
  );
}
