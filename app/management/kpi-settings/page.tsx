'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';

export default function KPISettingsPage() {
  const [targets, setTargets] = useState({
    leads: 350,
    pipeline: 2.5,
    closing: 0.6,
    conversion: 25,
    mrr: 130,
    churn: 2,
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          variant="violet"
          title="Pengaturan KPI"
          subtitle="Target dan indikator KPI yang ditampilkan di dashboard"
          badge={{ icon: 'ri-settings-3-line', text: 'Manajemen' }}
        >
          <Link href="/analytics/kpi" className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl flex items-center gap-2">
            <i className="ri-bar-chart-box-line"></i> Dashboard KPI
          </Link>
        </PageHero>

        <PageCard accent="emerald" icon="ri-dashboard-3-line" title="Target Bulanan (Bisa disesuaikan)">
          <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Leads</label>
              <input
                type="number"
                value={targets.leads}
                onChange={(e) => setTargets({ ...targets, leads: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pipeline (Rp M)</label>
              <input
                type="number"
                step="0.1"
                value={targets.pipeline}
                onChange={(e) => setTargets({ ...targets, pipeline: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Closing (Rp M)</label>
              <input
                type="number"
                step="0.1"
                value={targets.closing}
                onChange={(e) => setTargets({ ...targets, closing: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tingkat Konversi (%)</label>
              <input
                type="number"
                value={targets.conversion}
                onChange={(e) => setTargets({ ...targets, conversion: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target MRR (Rp Jt)</label>
              <input
                type="number"
                value={targets.mrr}
                onChange={(e) => setTargets({ ...targets, mrr: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Churn (max %)</label>
              <input
                type="number"
                step="0.1"
                value={targets.churn}
                onChange={(e) => setTargets({ ...targets, churn: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl cursor-pointer">
              Simpan Pengaturan
            </button>
          </div>
          </div>
        </PageCard>
      </div>
    </DashboardLayout>
  );
}
