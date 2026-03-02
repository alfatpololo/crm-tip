'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';
import FunnelChart from '@/components/dashboard/FunnelChart';

export default function AnalyticsFunnelPage() {
  const stages = [
    { name: 'Lead', count: 1250, percentage: 100, color: 'bg-blue-500' },
    { name: 'Dihubungi', count: 875, percentage: 70, color: 'bg-blue-600' },
    { name: 'Demo', count: 625, percentage: 50, color: 'bg-blue-700' },
    { name: 'Proposal', count: 375, percentage: 30, color: 'bg-blue-800' },
    { name: 'Negosiasi', count: 340, percentage: 27.2, color: 'bg-indigo-700' },
    { name: 'Closing', count: 310, percentage: 24.8, color: 'bg-indigo-800' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          variant="teal"
          title="Corong Konversi"
          subtitle="Tahapan dari lead hingga closing"
          badge={{ icon: 'ri-funnel-line', text: 'Analitik' }}
        >
          <Link href="/" className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl flex items-center gap-2">
            <i className="ri-dashboard-line"></i> Dashboard
          </Link>
        </PageHero>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PageCard accent="blue" icon="ri-funnel-line" title="Corong Konversi">
            <FunnelChart embedded />
          </PageCard>
          <PageCard accent="violet" icon="ri-bar-chart-grouped-line" title="Detail Tahap">
            <div className="space-y-4">
              {stages.map((s, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{s.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{s.count} ({s.percentage}%)</span>
                  </div>
                  <div className="h-10 bg-gray-100 rounded-lg overflow-hidden">
                    <div className={`h-full ${s.color} flex items-center justify-end px-3`} style={{ width: `${s.percentage}%` }}>
                      <span className="text-white text-xs font-semibold">{s.percentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </PageCard>
        </div>

        <PageCard accent="emerald" icon="ri-lightbulb-line" title="Insight">
          <p className="text-sm text-gray-600">Tingkat konversi tertinggi terjadi di tahap Dihubungi → Demo. Fokus pada kualitas follow-up dan demo untuk meningkatkan closing.</p>
          <Link href="/execution/leads" className="mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
            Kelola leads <i className="ri-arrow-right-line"></i>
          </Link>
        </PageCard>
      </div>
    </DashboardLayout>
  );
}
