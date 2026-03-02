'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';

export default function AnalyticsRetentionPage() {
  const retentionData = [
    { cohort: 'Jan 2024', m0: 100, m1: 92, m2: 88, m3: 85 },
    { cohort: 'Feb 2024', m0: 100, m1: 94, m2: 90, m3: null },
    { cohort: 'Mar 2024', m0: 100, m1: 93, m2: null, m3: null },
    { cohort: 'Apr 2024', m0: 100, m1: null, m2: null, m3: null },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          variant="amber"
          title="Churn & Retensi"
          subtitle="Tingkat retensi pelanggan dan churn"
          badge={{ icon: 'ri-user-follow-line', text: 'Analitik' }}
        >
          <Link href="/analytics/cac-ltv" className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl flex items-center gap-2">
            <i className="ri-scales-3-line"></i> CAC vs LTV
          </Link>
        </PageHero>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <PageCard accent="emerald" className="p-6">
            <p className="text-sm text-gray-500">Tingkat Churn (Bulanan)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">2.3%</p>
            <p className="text-xs text-green-600 mt-1">-0.8% vs kuartal lalu</p>
          </PageCard>
          <PageCard accent="blue" className="p-6">
            <p className="text-sm text-gray-500">Retensi Bulan 1</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">93%</p>
            <p className="text-xs text-gray-500 mt-1">Cohort terbaru</p>
          </PageCard>
          <PageCard accent="violet" className="p-6">
            <p className="text-sm text-gray-500">Retensi Bulan 3</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">85%</p>
            <p className="text-xs text-gray-500 mt-1">Cohort Jan 2024</p>
          </PageCard>
          <PageCard accent="slate" className="p-6">
            <p className="text-sm text-gray-500">LTV Rata-rata</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Rp 48Jt</p>
            <p className="text-xs text-gray-500 mt-1">12 bulan</p>
          </PageCard>
        </div>

        <PageCard accent="violet" icon="ri-table-line" title="Retensi per Kohort (%)">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Kohort</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Bulan 0</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Bulan 1</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Bulan 2</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Bulan 3</th>
                </tr>
              </thead>
              <tbody>
                {retentionData.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-900">{row.cohort}</td>
                    <td className="py-4 px-4 text-right text-gray-700">{row.m0}%</td>
                    <td className="py-4 px-4 text-right text-gray-700">{row.m1 != null ? `${row.m1}%` : '–'}</td>
                    <td className="py-4 px-4 text-right text-gray-700">{row.m2 != null ? `${row.m2}%` : '–'}</td>
                    <td className="py-4 px-4 text-right text-gray-700">{row.m3 != null ? `${row.m3}%` : '–'}</td>
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
