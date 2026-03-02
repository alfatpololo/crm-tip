'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import KPICard from '@/components/dashboard/KPICard';
import FunnelChart from '@/components/dashboard/FunnelChart';
import RevenueChart from '@/components/dashboard/RevenueChart';
import LeadsByChannel from '@/components/dashboard/LeadsByChannel';
import LeadsByProduct from '@/components/dashboard/LeadsByProduct';
import SalesLeaderboard from '@/components/dashboard/SalesLeaderboard';
import OverdueAlerts from '@/components/dashboard/OverdueAlerts';
import TeamSummaryByPIC from '@/components/dashboard/TeamSummaryByPIC';
import TeamActivityFeed from '@/components/dashboard/TeamActivityFeed';
import TeamTasksOverview from '@/components/dashboard/TeamTasksOverview';
import Link from 'next/link';

export default function Home() {
  const kpiData: { title: string; value: string; change: string; trend: 'up' | 'down'; subtitle: string }[] = [
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
          title="Ringkasan Dashboard"
          subtitle="Kontrol aktivitas tim: laporan pekerjaan, tugas per PIC, dan perkembangan bisnis. Untuk koordinator & tim."
          badge={{ icon: 'ri-dashboard-line', text: 'Overview' }}
          variant="indigo"
        >
          <Link
            href="/execution/activities"
            className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl flex items-center gap-2"
          >
            <i className="ri-calendar-check-line"></i> Input Laporan & Aktivitas
          </Link>
        </PageHero>

        {/* Bagian untuk Nina / Koordinator: kontrol tim */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i className="ri-team-line text-indigo-600"></i>
            Kontrol Aktivitas Tim
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Lihat siapa mengerjakan apa: laporan pekerjaan terkini dan tugas pending per PIC. Data dari input tim di Aktivitas & Tugas & Tindak Lanjut.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <TeamSummaryByPIC />
            </div>
            <div className="lg:col-span-2">
              <TeamActivityFeed />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TeamTasksOverview />
            <div className="bg-white rounded-2xl border border-gray-200/90 shadow-md shadow-gray-200/40 overflow-hidden border-l-4 border-l-sky-500">
              <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-sky-50/80 to-white">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <i className="ri-links-line text-sky-600"></i>
                  Akses cepat
                </h3>
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/execution/activities"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-indigo-50 hover:border-indigo-100 transition-all group"
                >
                  <span className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200">
                    <i className="ri-calendar-check-line text-lg"></i>
                  </span>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-700 flex-1 min-w-0">Aktivitas & Laporan</span>
                  <i className="ri-arrow-right-s-line text-gray-400 group-hover:text-indigo-500 text-lg flex-shrink-0"></i>
                </Link>
                <Link
                  href="/execution/activities#input-laporan"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-emerald-50 hover:border-emerald-100 transition-all group"
                >
                  <span className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200">
                    <i className="ri-file-edit-line text-lg"></i>
                  </span>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-emerald-700 flex-1 min-w-0">Input Laporan</span>
                  <i className="ri-arrow-right-s-line text-gray-400 group-hover:text-emerald-500 text-lg flex-shrink-0"></i>
                </Link>
                <Link
                  href="/execution/activities"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-violet-50 hover:border-violet-100 transition-all group"
                >
                  <span className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-200">
                    <i className="ri-bar-chart-box-line text-lg"></i>
                  </span>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-violet-700 flex-1 min-w-0">KPI per Orang</span>
                  <i className="ri-arrow-right-s-line text-gray-400 group-hover:text-violet-500 text-lg flex-shrink-0"></i>
                </Link>
                <Link
                  href="/execution/tasks"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-amber-50 hover:border-amber-100 transition-all group"
                >
                  <span className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-200">
                    <i className="ri-task-line text-lg"></i>
                  </span>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-amber-700 flex-1 min-w-0">Tugas & Tindak Lanjut</span>
                  <i className="ri-arrow-right-s-line text-gray-400 group-hover:text-amber-500 text-lg flex-shrink-0"></i>
                </Link>
                <Link
                  href="/crm/pipeline"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-sky-50 hover:border-sky-100 transition-all group sm:col-span-2"
                >
                  <span className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-200">
                    <i className="ri-kanban-view text-lg"></i>
                  </span>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-sky-700 flex-1 min-w-0">Papan Pipeline</span>
                  <i className="ri-arrow-right-s-line text-gray-400 group-hover:text-sky-500 text-lg flex-shrink-0"></i>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Indikator Bisnis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {kpiData.map((kpi, index) => (
              <KPICard key={index} {...kpi} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FunnelChart />
          <RevenueChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeadsByChannel />
          <LeadsByProduct />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SalesLeaderboard />
          </div>
          <OverdueAlerts />
        </div>
      </div>
    </DashboardLayout>
  );
}