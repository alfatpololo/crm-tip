'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';

export default function AnalyticsCACLTVPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          variant="rose"
          title="CAC vs LTV"
          subtitle="Customer Acquisition Cost dan Lifetime Value"
          badge={{ icon: 'ri-scales-3-line', text: 'Analitik' }}
        >
          <Link href="/analytics/retention" className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl flex items-center gap-2">
            <i className="ri-user-follow-line"></i> Churn & Retensi
          </Link>
        </PageHero>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <PageCard accent="slate" className="p-6">
            <p className="text-sm text-gray-500">CAC (Rata-rata)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Rp 2,8Jt</p>
            <p className="text-xs text-gray-500 mt-1">Per lead yang closing</p>
          </PageCard>
          <PageCard accent="blue" className="p-6">
            <p className="text-sm text-gray-500">LTV (Rata-rata)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Rp 48Jt</p>
            <p className="text-xs text-gray-500 mt-1">12 bulan</p>
          </PageCard>
          <PageCard accent="emerald" className="p-6">
            <p className="text-sm text-gray-500">Rasio LTV : CAC</p>
            <p className="text-2xl font-bold text-green-700 mt-1">17.1x</p>
            <p className="text-xs text-green-600 mt-1">Target &gt; 3x</p>
          </PageCard>
          <PageCard accent="violet" className="p-6">
            <p className="text-sm text-gray-500">Payback Period</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">2.1 bln</p>
            <p className="text-xs text-gray-500 mt-1">CAC tertutup dalam</p>
          </PageCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PageCard accent="blue" icon="ri-line-chart-line" title="CAC per Saluran">
            <div className="space-y-3">
              {[
                { channel: 'WA', cac: 1.2, ltv: 52 },
                { channel: 'IG', cac: 2.5, ltv: 45 },
                { channel: 'Facebook', cac: 3.2, ltv: 48 },
                { channel: 'Email', cac: 3.8, ltv: 44 },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="font-medium text-gray-900">{r.channel}</span>
                  <span className="text-gray-700">Rp {r.cac}Jt</span>
                </div>
              ))}
            </div>
          </PageCard>
          <PageCard accent="emerald" icon="ri-lightbulb-line" title="Insight">
            <p className="text-sm text-gray-600">
              LTV:CAC saat ini 17.1x, sangat sehat. WA memiliki CAC terendah. Pertahankan fokus pada WA dan IG untuk efisiensi akuisisi.
            </p>
            <Link href="/execution/channels" className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
              Lihat sumber saluran <i className="ri-arrow-right-line"></i>
            </Link>
          </PageCard>
        </div>
      </div>
    </DashboardLayout>
  );
}
