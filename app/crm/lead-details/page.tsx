'use client';

import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';
import { LEADS_DATA } from '@/lib/leadsData';

export default function LeadDetailsListPage() {
  const [search, setSearch] = useState('');
  const leads = useMemo(() => {
    if (!search.trim()) return LEADS_DATA;
    const q = search.toLowerCase();
    return LEADS_DATA.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
    );
  }, [search]);

  const getStageColor = (stage: string) => {
    const m: Record<string, string> = { Lead: 'bg-gray-100 text-gray-700', Dihubungi: 'bg-blue-100 text-blue-700', Demo: 'bg-purple-100 text-purple-700', Proposal: 'bg-yellow-100 text-yellow-700', Negosiasi: 'bg-orange-100 text-orange-700', Closing: 'bg-green-100 text-green-700' };
    return m[stage] || 'bg-gray-100 text-gray-700';
  };
  const formatRupiah = (v: number) => (v >= 1e9 ? `Rp ${(v / 1e9).toFixed(1)}M` : `Rp ${(v / 1e6).toFixed(0)}Jt`);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          variant="indigo"
          title="Detail Lead"
          subtitle="Pilih lead untuk melihat detail lengkap dan riwayat"
          badge={{ icon: 'ri-user-search-line', text: 'CRM' }}
        >
          <Link
            href="/execution/leads"
            className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <i className="ri-add-line text-lg w-5 h-5"></i>
            Tambah Lead
          </Link>
        </PageHero>

        <PageCard accent="violet" icon="ri-user-search-line" title="Daftar Lead">
          <div className="p-4 border-b border-gray-200">
            <div className="relative max-w-md">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Cari nama atau perusahaan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Nama</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Perusahaan</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Tahap</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Nilai</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">PIC</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">{lead.name}</td>
                    <td className="py-4 px-4 text-gray-700">{lead.company}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStageColor(lead.stage)}`}>{lead.stage}</span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-gray-900">{formatRupiah(lead.value)}</td>
                    <td className="py-4 px-4 text-gray-700">{lead.pic}</td>
                    <td className="py-4 px-4 text-center">
                      <Link
                        href={`/crm/lead-details/${lead.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                      >
                        <i className="ri-eye-line w-5 h-5"></i>
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
