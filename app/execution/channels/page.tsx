'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';

export default function ChannelsPage() {
  const [search, setSearch] = useState('');
  const channels = [
    { id: 1, name: 'IG', leads: 142, conversion: 22.5, value: 890000000, icon: 'ri-instagram-line' },
    { id: 2, name: 'WA', leads: 98, conversion: 28.9, value: 620000000, icon: 'ri-whatsapp-line' },
    { id: 3, name: 'Facebook', leads: 76, conversion: 24.1, value: 480000000, icon: 'ri-facebook-circle-line' },
    { id: 4, name: 'Email', leads: 44, conversion: 18.1, value: 280000000, icon: 'ri-mail-line' },
  ];

  const formatRupiah = (v: number) => (v >= 1e9 ? `Rp ${(v / 1e9).toFixed(1)}M` : `Rp ${(v / 1e6).toFixed(0)}Jt`);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero variant="teal"
          title="Sumber Saluran"
          subtitle="Leads per saluran dan performa konversi"
          badge={{ icon: 'ri-share-line', text: 'Eksekusi' }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="Cari saluran..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 w-48"
              />
            </div>
            <button className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl transition-colors flex items-center gap-2">
              <i className="ri-add-line text-lg w-5 h-5"></i>
              Tambah Saluran
            </button>
          </div>
        </PageHero>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {channels.map((ch) => (
            <PageCard key={ch.id} accent="blue" className="border-l-4">
              <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <i className={`${ch.icon} text-2xl text-blue-600`}></i>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">{ch.conversion}% konversi</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{ch.name}</h3>
              <p className="text-2xl font-bold text-gray-900">{ch.leads} leads</p>
              <p className="text-sm text-gray-500 mt-1">Nilai pipeline: {formatRupiah(ch.value)}</p>
              <Link
                href="/execution/leads"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Lihat leads <i className="ri-arrow-right-line"></i>
              </Link>
              </div>
            </PageCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
