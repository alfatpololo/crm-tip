'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';

export default function ForecastingPage() {
  const months = [
    { month: 'Jan 2024', pipeline: 2.4, forecast: 0.58, actual: 0.58 },
    { month: 'Feb 2024', pipeline: 2.6, forecast: 0.62, actual: null },
    { month: 'Mar 2024', pipeline: 2.8, forecast: 0.68, actual: null },
    { month: 'Apr 2024', pipeline: 2.5, forecast: 0.65, actual: null },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          variant="blue"
          title="Peramalan"
          subtitle="Proyeksi pendapatan berdasarkan pipeline dan conversion"
          badge={{ icon: 'ri-line-chart-line', text: 'CRM' }}
        >
          <div className="flex items-center gap-3">
            <select className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer [&>option]:text-gray-900">
              <option>Q1 2024</option>
              <option>Q2 2024</option>
              <option>Tahun 2024</option>
            </select>
            <Link href="/analytics/revenue" className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl flex items-center gap-2">
              <i className="ri-money-dollar-circle-line"></i> Analitik Pendapatan
            </Link>
          </div>
        </PageHero>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PageCard accent="blue" className="p-6">
            <p className="text-sm text-gray-500">Pipeline Tertimbang (Bulan Ini)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Rp 0,62M</p>
            <p className="text-xs text-gray-500 mt-1">Weighted by stage probability</p>
          </PageCard>
          <PageCard accent="emerald" className="p-6">
            <p className="text-sm text-gray-500">Peramalan Q1 2024</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Rp 1,88M</p>
            <p className="text-xs text-green-600 mt-1">+8% vs target</p>
          </PageCard>
          <PageCard accent="slate" className="p-6">
            <p className="text-sm text-gray-500">Tingkat Konversi Rata-rata</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">24.8%</p>
            <p className="text-xs text-gray-500 mt-1">Lead → Closing</p>
          </PageCard>
        </div>

        <PageCard accent="violet" icon="ri-line-chart-line" title="Peramalan per Bulan (Rp M)">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Bulan</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Pipeline</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Forecast</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Realisasi</th>
                </tr>
              </thead>
              <tbody>
                {months.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{row.month}</td>
                    <td className="py-4 px-4 text-right text-gray-700">{row.pipeline}</td>
                    <td className="py-4 px-4 text-right font-semibold text-gray-900">{row.forecast}</td>
                    <td className="py-4 px-4 text-right text-gray-700">{row.actual ?? '–'}</td>
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
