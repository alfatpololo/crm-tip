'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import Link from 'next/link';
import { getLeadById } from '@/lib/leadsData';

export default function LeadDetailContent({ id }: { id: string }) {
  const lead = getLeadById(id);

  if (!lead) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500 mb-4">Lead tidak ditemukan.</p>
            <Link href="/crm/lead-details" className="text-blue-600 hover:text-blue-700 font-medium">Kembali ke daftar lead</Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const formatRupiah = (v: number) => (v >= 1e9 ? `Rp ${(v / 1e9).toFixed(1)}M` : `Rp ${(v / 1e6).toFixed(0)}Jt`);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          variant="rose"
          title={lead.name}
          subtitle={lead.company}
          badge={{ icon: 'ri-user-search-line', text: 'CRM' }}
        >
          <div className="flex items-center gap-3">
            <Link href="/crm/lead-details" className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/30 hover:bg-white/10 text-white">
              <i className="ri-arrow-left-line text-lg"></i>
            </Link>
            <Link href="/execution/activities" className="px-5 py-2.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl flex items-center gap-2">
              <i className="ri-calendar-check-line"></i> Log Aktivitas
            </Link>
            <button className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl flex items-center gap-2">
              <i className="ri-edit-line"></i> Edit Lead
            </button>
          </div>
        </PageHero>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PageCard accent="violet" icon="ri-contacts-line" title="Informasi Kontak">
              <div className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
                  <p className="text-gray-900">{lead.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Telepon</p>
                  <p className="text-gray-900">{lead.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Sumber</p>
                  <p className="text-gray-900">{lead.source}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">PIC</p>
                  <p className="text-gray-900">{lead.pic}</p>
                </div>
              </div>
              </div>
            </PageCard>
            <PageCard accent="slate" icon="ri-file-text-line" title="Catatan">
              <p className="text-gray-700 text-sm pt-2">{lead.notes}</p>
            </PageCard>
          </div>
          <div className="space-y-6">
            <PageCard accent="emerald" icon="ri-bar-chart-box-line" title="Status Deal">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tahap</span>
                  <span className="font-semibold text-gray-900">{lead.stage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Produk</span>
                  <span className="font-semibold text-gray-900">{lead.product}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Nilai</span>
                  <span className="font-semibold text-gray-900">{formatRupiah(lead.value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanggal masuk</span>
                  <span className="text-gray-900">{lead.createdAt}</span>
                </div>
              </div>
            </PageCard>
            <PageCard accent="blue" icon="ri-links-line" title="Tindakan Cepat">
              <div className="space-y-2">
                <Link href="/execution/activities" className="block w-full text-left px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700">
                  Lihat riwayat aktivitas
                </Link>
                <Link href="/execution/tasks" className="block w-full text-left px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700">
                  Tugas & follow-up
                </Link>
                <Link href="/crm/pipeline" className="block w-full text-left px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-medium text-gray-700">
                  Lihat di pipeline
                </Link>
              </div>
            </PageCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
