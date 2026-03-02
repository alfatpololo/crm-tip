'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';
import KPICard from '@/components/dashboard/KPICard';
import {
  CHANNEL_KPI_TARGETS,
  INCENTIVE_RULES,
  WEEKLY_CONTROL,
  FLOW_CONTROL,
} from '@/lib/marketingPerformanceControl';

export default function AnalyticsKPIPage() {
  const kpis = [
    { title: 'Total Leads', value: '342', change: '+12.5%', trend: 'up', subtitle: 'Bulan Ini' },
    { title: 'Nilai Pipeline Aktif', value: 'Rp 2,4M', change: '+8.3%', trend: 'up', subtitle: 'Kuartal Ini' },
    { title: 'Closing Bulan Ini', value: 'Rp 580Jt', change: '+15.2%', trend: 'up', subtitle: 'Perkiraan' },
    { title: 'Tingkat Konversi', value: '24.8%', change: '+3.1%', trend: 'up', subtitle: 'Lead ke Closing' },
    { title: 'Pertumbuhan MRR', value: 'Rp 125Jt', change: '+18.7%', trend: 'up', subtitle: 'Pendapatan Bulanan' },
    { title: 'Tingkat Churn', value: '2.3%', change: '-0.8%', trend: 'down', subtitle: 'Kuartal Ini' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          title="Dashboard KPI"
          subtitle="Indikator kinerja utama bisnis Anda"
          badge={{ icon: 'ri-dashboard-3-line', text: 'Analitik' }}
          variant="violet"
        >
          <Link href="/management/kpi-settings" className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl flex items-center gap-2">
            <i className="ri-settings-3-line"></i> Pengaturan KPI
          </Link>
        </PageHero>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Indikator Utama</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kpis.map((kpi, i) => (
              <KPICard key={i} {...kpi} />
            ))}
          </div>
        </section>

        {/* Marketing Performance Control Board — referensi Board-Level PDF */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Marketing Performance Control Board</h2>
          <p className="text-sm text-gray-600 mb-4">Target numerik bulanan per channel untuk 2 produk: MKASIR & DISIPLINKU. Semua aktivitas wajib tercatat di CRM; review mingguan untuk corrective action.</p>
          <PageCard accent="indigo" icon="ri-dashboard-2-line" title="Target KPI per Channel (Bulanan)">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Channel</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Lead</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Demo</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Proposal</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Closing</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {CHANNEL_KPI_TARGETS.map((row) => (
                    <tr key={row.channelKey} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-medium text-gray-900">{row.channel}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-gray-700">{row.leadTarget}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-gray-700">{row.demoTarget}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-gray-700">{row.proposalTarget}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-gray-700">{row.closingTarget}</td>
                      <td className="py-3 px-4 text-right tabular-nums font-medium text-gray-900">Rp {row.revenueTargetJt} jt</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-3">Bobot skor: Revenue 40%, Activity KPI 30%, Conversion KPI 30%. Skor 100% target = 100; 80–99% = 80; 60–79% = 60; &lt;60% = 40.</p>
          </PageCard>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PageCard accent="emerald" icon="ri-gift-line" title="Struktur Insentif (Score)">
            <ul className="space-y-2 text-sm text-gray-700">
              {INCENTIVE_RULES.map((r, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${r.color === 'green' ? 'bg-green-500' : r.color === 'emerald' ? 'bg-emerald-500' : r.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'}`} />
                  {r.minScore > 0 ? `Score ≥${r.minScore}:` : 'Score &lt;70:'} {r.label}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-3">Bonus cross-sell untuk bundling Mkasir + Disiplinku.</p>
          </PageCard>
          <PageCard accent="violet" icon="ri-flow-chart" title="Alur Kontrol End-to-End">
            <ul className="space-y-1.5 text-sm text-gray-700">
              {FLOW_CONTROL.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <i className="ri-arrow-right-s-line text-violet-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </PageCard>
        </div>

        <PageCard accent="amber" icon="ri-calendar-week-line" title="Kontrol Mingguan">
          <ul className="space-y-1.5 text-sm text-gray-700">
            {WEEKLY_CONTROL.map((item, i) => (
              <li key={i} className="flex gap-2">
                <i className="ri-checkbox-circle-line text-amber-500 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </PageCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PageCard accent="blue" icon="ri-pie-chart-line" title="KPI per Kategori">
            <p className="text-sm text-gray-600">Ringkasan KPI eksekusi, CRM, dan analitik tersedia di dashboard utama dan halaman terkait.</p>
            <Link href="/" className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
              Lihat dashboard utama <i className="ri-arrow-right-line"></i>
            </Link>
          </PageCard>
          <PageCard accent="violet" icon="ri-links-line" title="Tautan Analitik">
            <div className="space-y-2">
              <Link href="/analytics/funnel" className="block text-sm text-blue-600 hover:text-blue-700">Corong Konversi</Link>
              <Link href="/analytics/revenue" className="block text-sm text-blue-600 hover:text-blue-700">Analitik Pendapatan</Link>
              <Link href="/analytics/retention" className="block text-sm text-blue-600 hover:text-blue-700">Churn & Retensi</Link>
              <Link href="/analytics/cac-ltv" className="block text-sm text-blue-600 hover:text-blue-700">CAC vs LTV</Link>
            </div>
          </PageCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
