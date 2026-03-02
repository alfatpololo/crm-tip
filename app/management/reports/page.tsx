'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';

export default function ReportsPage() {
  const [period, setPeriod] = useState('month');
  const reportTypes = [
    { id: 1, name: 'Laporan Leads', description: 'Export daftar leads dengan filter', format: 'Excel, CSV', link: '/execution/leads' },
    { id: 2, name: 'Laporan Pipeline', description: 'Snapshot pipeline per tahap', format: 'Excel, PDF', link: '/crm/pipeline' },
    { id: 3, name: 'Laporan Aktivitas', description: 'Riwayat aktivitas per periode', format: 'Excel, CSV', link: '/execution/activities' },
    { id: 4, name: 'Laporan Performa Sales', description: 'Target vs realisasi per sales rep', format: 'Excel, PDF', link: '/crm/performance' },
    { id: 5, name: 'Laporan Pendapatan', description: 'Revenue dan MRR per periode', format: 'Excel, PDF', link: '/analytics/revenue' },
    { id: 6, name: 'Laporan KPI', description: 'Dashboard KPI export', format: 'PDF', link: '/analytics/kpi' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          variant="cyan"
          title="Ekspor Laporan"
          subtitle="Download laporan dalam format Excel, CSV, atau PDF"
          badge={{ icon: 'ri-file-download-line', text: 'Manajemen' }}
        >
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer [&>option]:text-gray-900"
          >
            <option value="month">Bulan ini</option>
            <option value="quarter">Kuartal ini</option>
            <option value="year">Tahun ini</option>
          </select>
        </PageHero>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTypes.map((r) => (
            <PageCard key={r.id} accent="blue" className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <i className="ri-file-download-line text-blue-600 text-xl"></i>
                </div>
                <span className="text-xs text-gray-500">{r.format}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{r.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{r.description}</p>
              <div className="flex items-center gap-2">
                <Link href={r.link} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Lihat data
                </Link>
                <span className="text-gray-300">|</span>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer">
                  Ekspor
                </button>
              </div>
            </PageCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
