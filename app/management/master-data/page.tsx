'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState<'activities' | 'stages' | 'products' | 'channels'>('activities');

  const activityTypes = [
    { id: 1, name: 'Panggilan', code: 'call', isActive: true },
    { id: 2, name: 'Email', code: 'email', isActive: true },
    { id: 3, name: 'Meeting', code: 'meeting', isActive: true },
    { id: 4, name: 'Demo', code: 'demo', isActive: true },
  ];

  const stages = [
    { id: 1, name: 'Lead', order: 1, isActive: true },
    { id: 2, name: 'Dihubungi', order: 2, isActive: true },
    { id: 3, name: 'Demo', order: 3, isActive: true },
    { id: 4, name: 'Proposal', order: 4, isActive: true },
    { id: 5, name: 'Negosiasi', order: 5, isActive: true },
    { id: 6, name: 'Closing', order: 6, isActive: true },
    { id: 7, name: 'Gagal', order: 7, isActive: true },
  ];

  const products = [
    { id: 1, name: 'MKASIR Retail', code: 'mkasir-retail', isActive: true },
    { id: 2, name: 'MKASIR F&B', code: 'mkasir-fnb', isActive: true },
    { id: 3, name: 'MKASIR Persewaan', code: 'mkasir-persewaan', isActive: true },
    { id: 4, name: 'DISIPLINKU', code: 'disiplinku', isActive: true },
    { id: 5, name: 'Salespoint', code: 'salespoint', isActive: true },
  ];

  const channels = [
    { id: 1, name: 'IG', code: 'ig', isActive: true },
    { id: 2, name: 'WA', code: 'wa', isActive: true },
    { id: 3, name: 'Facebook', code: 'facebook', isActive: true },
    { id: 4, name: 'Email', code: 'email', isActive: true },
  ];

  const tabs = [
    { id: 'activities' as const, label: 'Tipe Aktivitas', icon: 'ri-calendar-check-line' },
    { id: 'stages' as const, label: 'Tahap Pipeline', icon: 'ri-kanban-view' },
    { id: 'products' as const, label: 'Produk', icon: 'ri-box-3-line' },
    { id: 'channels' as const, label: 'Saluran', icon: 'ri-share-line' },
  ];

  const renderTable = () => {
    if (activeTab === 'activities') {
      return (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Nama</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Kode</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {activityTypes.map((r) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">{r.name}</td>
                <td className="py-4 px-4 text-gray-600">{r.code}</td>
                <td className="py-4 px-4"><span className="text-green-600 text-sm">Aktif</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    if (activeTab === 'stages') {
      return (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Urutan</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Tahap</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((r) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">{r.order}</td>
                <td className="py-4 px-4 text-gray-900">{r.name}</td>
                <td className="py-4 px-4"><span className="text-green-600 text-sm">Aktif</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    if (activeTab === 'products') {
      return (
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Nama</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Kode</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((r) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium text-gray-900">{r.name}</td>
                <td className="py-4 px-4 text-gray-600">{r.code}</td>
                <td className="py-4 px-4"><span className="text-green-600 text-sm">Aktif</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return (
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Nama</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Kode</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody>
          {channels.map((r) => (
            <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-4 px-4 font-medium text-gray-900">{r.name}</td>
              <td className="py-4 px-4 text-gray-600">{r.code}</td>
              <td className="py-4 px-4"><span className="text-green-600 text-sm">Aktif</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          variant="indigo"
          title="Data Master Aktivitas"
          subtitle="Referensi tipe aktivitas, tahap pipeline, produk, dan saluran"
          badge={{ icon: 'ri-database-2-line', text: 'Manajemen' }}
        />

        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-xl flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === t.id ? 'bg-white border border-b-0 border-gray-200 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <i className={t.icon}></i> {t.label}
            </button>
          ))}
        </div>

        <PageCard accent="violet" icon={tabs.find(t => t.id === activeTab)?.icon} title={tabs.find(t => t.id === activeTab)?.label}>
          <div className="flex justify-end pb-3">
            <button className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl cursor-pointer">Tambah</button>
          </div>
          <div className="overflow-x-auto">{renderTable()}</div>
        </PageCard>
      </div>
    </DashboardLayout>
  );
}
