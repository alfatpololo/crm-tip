'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';

export default function PerformancePage() {
  const reps = [
    { name: 'Nina', deals: 12, value: 58000000, target: 50000000, achievement: 116, leads: 45 },
    { name: 'Ilham', deals: 9, value: 42000000, target: 45000000, achievement: 93.3, leads: 38 },
    { name: 'Robby', deals: 11, value: 49500000, target: 48000000, achievement: 103.1, leads: 42 },
    { name: 'Radi', deals: 8, value: 32000000, target: 40000000, achievement: 80, leads: 35 },
    { name: 'Jemi', deals: 7, value: 28500000, target: 35000000, achievement: 81.4, leads: 30 },
  ];

  const formatRupiah = (v: number) => (v >= 1e9 ? `Rp ${(v / 1e9).toFixed(1)}M` : `Rp ${(v / 1e6).toFixed(0)}Jt`);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          variant="emerald"
          title="Performa Penjualan"
          subtitle="Target vs realisasi per sales rep"
          badge={{ icon: 'ri-trophy-line', text: 'CRM' }}
        >
          <div className="flex items-center gap-3">
            <select className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer [&>option]:text-gray-900">
              <option>Bulan ini</option>
              <option>Kuartal ini</option>
              <option>Tahun ini</option>
            </select>
            <Link href="/analytics/revenue" className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl flex items-center gap-2">
              <i className="ri-line-chart-line"></i> Analitik Pendapatan
            </Link>
          </div>
        </PageHero>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PageCard accent="emerald" className="p-6">
            <p className="text-sm text-gray-500">Total Closing Bulan Ini</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Rp 210Jt</p>
            <p className="text-xs text-green-600 mt-1">+12% vs bulan lalu</p>
          </PageCard>
          <PageCard accent="slate" className="p-6">
            <p className="text-sm text-gray-500">Target Kuartal</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Rp 540Jt</p>
            <p className="text-xs text-gray-500 mt-1">Q1 2024</p>
          </PageCard>
          <PageCard accent="emerald" className="p-6">
            <p className="text-sm text-gray-500">Realisasi Kuartal</p>
            <p className="text-2xl font-bold text-green-700 mt-1">Rp 210Jt</p>
            <p className="text-xs text-gray-500 mt-1">38.9% tercapai</p>
          </PageCard>
          <PageCard accent="slate" className="p-6">
            <p className="text-sm text-gray-500">Deal Rata-rata</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Rp 14Jt</p>
            <p className="text-xs text-gray-500 mt-1">40 deal</p>
          </PageCard>
        </div>

        <PageCard accent="violet" icon="ri-trophy-line" title="Performa per Sales Rep">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Sales Rep</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Deal</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Nilai</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Target</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Pencapaian</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Leads</th>
                </tr>
              </thead>
              <tbody>
                {reps.map((r, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{r.name}</td>
                    <td className="py-4 px-4 text-right text-gray-900">{r.deals}</td>
                    <td className="py-4 px-4 text-right font-semibold text-gray-900">{formatRupiah(r.value)}</td>
                    <td className="py-4 px-4 text-right text-gray-700">{formatRupiah(r.target)}</td>
                    <td className="py-4 px-4 text-right">
                      <span className={r.achievement >= 100 ? 'text-green-600 font-semibold' : 'text-amber-600 font-semibold'}>{r.achievement}%</span>
                    </td>
                    <td className="py-4 px-4 text-right text-gray-700">{r.leads}</td>
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
