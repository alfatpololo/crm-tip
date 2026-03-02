'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';

export default function RolesPage() {
  const [search, setSearch] = useState('');
  const roles = [
    { id: 1, name: 'Admin', users: 2, permissions: 'Full access', description: 'Akses penuh ke semua modul' },
    { id: 2, name: 'Sales Manager', users: 3, permissions: 'CRM, Execution, Analytics', description: 'Kelola pipeline, leads, dan laporan' },
    { id: 3, name: 'Sales Rep', users: 8, permissions: 'Leads, Pipeline, Activities', description: 'Input lead, aktivitas, dan tugas' },
    { id: 4, name: 'Viewer', users: 5, permissions: 'Dashboard, Reports (read)', description: 'Hanya lihat dashboard dan laporan' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          variant="slate"
          title="Peran Pengguna"
          subtitle="Kelola role dan permission akses"
          badge={{ icon: 'ri-shield-user-line', text: 'Manajemen' }}
        >
          <button className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl flex items-center gap-2 cursor-pointer">
            <i className="ri-add-line text-lg w-5 h-5"></i>
            Tambah Role
          </button>
        </PageHero>

        <PageCard accent="blue" icon="ri-shield-user-line" title="Daftar Role">
          <div className="p-4 border-b border-gray-200">
            <div className="relative max-w-md">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Cari role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Deskripsi</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Permission</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Pengguna</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                          <i className="ri-shield-user-line text-blue-600 text-lg"></i>
                        </div>
                        <span className="font-medium text-gray-900">{r.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{r.description}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{r.permissions}</td>
                    <td className="py-4 px-4 text-right font-semibold text-gray-900">{r.users}</td>
                    <td className="py-4 px-4 text-center">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer">
                        <i className="ri-edit-line w-5 h-5"></i>
                      </button>
                    </td>
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
