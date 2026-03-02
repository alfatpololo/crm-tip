'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import PipelineBoard from '@/components/crm/PipelineBoard';

export default function PipelinePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          variant="violet"
          title="Papan Pipeline"
          subtitle="Kelola pipeline penjualan Anda secara visual"
          badge={{ icon: 'ri-bar-chart-box-line', text: 'CRM' }}
        >
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap">
              <i className="ri-filter-3-line w-5 h-5"></i>
              Filter
            </button>
            <button className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap">
              <i className="ri-add-line text-lg w-5 h-5"></i>
              Tambah Deal
            </button>
          </div>
        </PageHero>

        <PageCard accent="violet" icon="ri-bar-chart-box-line" title="Pipeline">
          <PipelineBoard />
        </PageCard>
      </div>
    </DashboardLayout>
  );
}