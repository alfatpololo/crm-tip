'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import LeadsTable from '@/components/execution/LeadsTable';
import AddLeadModal from '@/components/execution/AddLeadModal';

export default function LeadsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    product: 'all',
    channel: 'all',
    stage: 'all',
    pic: 'all',
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          title="Manajemen Leads"
          subtitle="Lacak dan kelola semua leads Anda dalam satu tempat"
          badge={{ icon: 'ri-user-add-line', text: 'Eksekusi' }}
          variant="blue"
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <i className="ri-add-line text-lg w-5 h-5"></i>
            Tambah Lead Baru
          </button>
        </PageHero>

        <PageCard accent="blue">
          <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg w-5 h-5 flex items-center justify-center"></i>
              <input
                type="text"
                placeholder="Cari leads..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <select
                value={filters.product}
                onChange={(e) => setFilters({ ...filters, product: e.target.value })}
                className="w-full px-4 py-2 pr-8 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">Semua Produk</option>
                <option value="mkasir-retail">MKASIR Retail</option>
                <option value="mkasir-fnb">MKASIR F&B</option>
                <option value="mkasir-persewaan">MKASIR Persewaan</option>
                <option value="disiplinku">DISIPLINKU</option>
                <option value="salespoint">Salespoint</option>
              </select>
              <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5 flex items-center justify-center"></i>
            </div>

            <div className="relative">
              <select
                value={filters.channel}
                onChange={(e) => setFilters({ ...filters, channel: e.target.value })}
                className="w-full px-4 py-2 pr-8 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">Semua Saluran</option>
                <option value="ig">IG</option>
                <option value="wa">WA</option>
                <option value="facebook">Facebook</option>
                <option value="email">Email</option>
              </select>
              <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5 flex items-center justify-center"></i>
            </div>

            <div className="relative">
              <select
                value={filters.stage}
                onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
                className="w-full px-4 py-2 pr-8 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">Semua Tahap</option>
                <option value="lead">Lead</option>
                <option value="contacted">Dihubungi</option>
                <option value="demo">Demo</option>
                <option value="proposal">Proposal</option>
                <option value="negotiation">Negosiasi</option>
                <option value="closing">Closing</option>
              </select>
              <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5 flex items-center justify-center"></i>
            </div>

            <div className="relative">
              <select
                value={filters.pic}
                onChange={(e) => setFilters({ ...filters, pic: e.target.value })}
                className="w-full px-4 py-2 pr-8 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">Semua Sales Rep</option>
                <option value="alfath">Alfath</option>
                <option value="nina">Nina</option>
                <option value="ilham">Ilham</option>
                <option value="roby">Roby</option>
                <option value="radi">Radi</option>
                <option value="jemi">Jemi</option>
              </select>
              <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5 flex items-center justify-center"></i>
            </div>
          </div>

          <LeadsTable filters={filters} />
          </div>
        </PageCard>
      </div>

      {isModalOpen && <AddLeadModal onClose={() => setIsModalOpen(false)} />}
    </DashboardLayout>
  );
}