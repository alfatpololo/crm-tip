'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';
import RevenueChart from '@/components/dashboard/RevenueChart';

export default function AnalyticsRevenuePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          variant="emerald"
          title="Analitik Pendapatan"
          subtitle="Trend pendapatan dan breakdown per sumber"
          badge={{ icon: 'ri-line-chart-line', text: 'Analitik' }}
        >
          <div className="flex items-center gap-3">
            <select className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer [&>option]:text-gray-900">
              <option>6 Bulan</option>
              <option>1 Tahun</option>
            </select>
            <Link href="/crm/performance" className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl flex items-center gap-2">
              <i className="ri-line-chart-line"></i> Performa Penjualan
            </Link>
          </div>
        </PageHero>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <PageCard accent="emerald" className="p-6">
            <p className="text-sm text-gray-500">MRR Saat Ini</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Rp 125Jt</p>
            <p className="text-xs text-green-600 mt-1">+18.7%</p>
          </PageCard>
          <PageCard accent="blue" className="p-6">
            <p className="text-sm text-gray-500">Closing Bulan Ini</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Rp 580Jt</p>
            <p className="text-xs text-green-600 mt-1">+15.2%</p>
          </PageCard>
          <PageCard accent="slate" className="p-6">
            <p className="text-sm text-gray-500">Pipeline Aktif</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Rp 2,4M</p>
            <p className="text-xs text-gray-500 mt-1">Kuartal ini</p>
          </PageCard>
          <PageCard accent="violet" className="p-6">
            <p className="text-sm text-gray-500">ARPU</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">Rp 4,2Jt</p>
            <p className="text-xs text-gray-500 mt-1">Rata-rata per user</p>
          </PageCard>
        </div>

        <PageCard accent="blue" icon="ri-line-chart-line" title="Trend Pendapatan">
          <RevenueChart embedded />
        </PageCard>

        <PageCard accent="emerald" icon="ri-pie-chart-line" title="Pendapatan per Produk">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">MKASIR Retail</span>
              <span className="font-semibold text-gray-900">Rp 420Jt</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">MKASIR F&B</span>
              <span className="font-semibold text-gray-900">Rp 180Jt</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">MKASIR Persewaan</span>
              <span className="font-semibold text-gray-900">Rp 95Jt</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">DISIPLINKU</span>
              <span className="font-semibold text-gray-900">Rp 280Jt</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">Salespoint</span>
              <span className="font-semibold text-gray-900">Rp 165Jt</span>
            </div>
          </div>
        </PageCard>
      </div>
    </DashboardLayout>
  );
}
