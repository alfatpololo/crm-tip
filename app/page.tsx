'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import DistribusiProgressProduk from '@/components/dashboard/DistribusiProgressProduk';
import KontrolKPIAktivitas from '@/components/dashboard/KontrolKPIAktivitas';
import DailyExecutionMonitoring from '@/components/dashboard/DailyExecutionMonitoring';
import StaffTaskWidget from '@/components/dashboard/StaffTaskWidget';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { role } = useAuth();
  const isCoordinator = role === 'koordinator' || role === 'management';

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <StaffTaskWidget />
        <PageHero
          title="Ringkasan Dashboard"
          subtitle={isCoordinator ? 'Kontrol aktivitas tim: distribusi progress produk, KPI aktivitas, dan daily execution.' : 'Dashboard tugas dan akses cepat.'}
          badge={{ icon: 'ri-dashboard-line', text: 'Overview' }}
          variant="indigo"
        >
          {isCoordinator && (
            <Link
              href="/execution/input-task-kpi"
              className="px-5 py-2.5 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold rounded-xl flex items-center gap-2"
            >
              <i className="ri-checkbox-circle-line"></i> Input Task KPI
            </Link>
          )}
        </PageHero>

        {/* 1. Distribusi Progress Produk per PIC */}
        <section>
          <DistribusiProgressProduk />
        </section>

        {/* 2. Kontrol KPI Aktivitas (aktivitas horizontal, PIC vertikal) */}
        <section>
          <KontrolKPIAktivitas />
        </section>

        {/* 3. Daily Execution Monitoring */}
        <section>
          <DailyExecutionMonitoring />
        </section>

        {/* Akses cepat: koordinator semua link, staff hanya Tugas & Content Planner */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden border-l-4 border-l-sky-500">
          <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-sky-50/80 to-white">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <i className="ri-links-line text-sky-600"></i>
              Akses cepat
            </h3>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {isCoordinator && (
              <>
                <Link
                  href="/execution/activities"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-indigo-50 hover:border-indigo-100 transition-all group"
                >
                  <span className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200">
                    <i className="ri-calendar-check-line text-lg"></i>
                  </span>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-indigo-700 flex-1 min-w-0">Input Target</span>
                  <i className="ri-arrow-right-s-line text-gray-400 group-hover:text-indigo-500 text-lg flex-shrink-0"></i>
                </Link>
                <Link
                  href="/execution/input-task-kpi"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-emerald-50 hover:border-emerald-100 transition-all group"
                >
                  <span className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200">
                    <i className="ri-file-edit-line text-lg"></i>
                  </span>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-emerald-700 flex-1 min-w-0">Input Task KPI</span>
                  <i className="ri-arrow-right-s-line text-gray-400 group-hover:text-emerald-500 text-lg flex-shrink-0"></i>
                </Link>
                <Link
                  href="/execution/laporan-kpi"
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-violet-50 hover:border-violet-100 transition-all group"
                >
                  <span className="w-10 h-10 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-200">
                    <i className="ri-file-chart-line text-lg"></i>
                  </span>
                  <span className="text-sm font-medium text-gray-900 group-hover:text-violet-700 flex-1 min-w-0">Laporan KPI</span>
                  <i className="ri-arrow-right-s-line text-gray-400 group-hover:text-violet-500 text-lg flex-shrink-0"></i>
                </Link>
              </>
            )}
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
              href="/execution/content-planner"
              className={`flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-sky-50 hover:border-sky-100 transition-all group ${isCoordinator ? 'sm:col-span-2' : ''}`}
            >
              <span className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-200">
                <i className="ri-calendar-event-line text-lg"></i>
              </span>
              <span className="text-sm font-medium text-gray-900 group-hover:text-sky-700 flex-1 min-w-0">Content Planner</span>
              <i className="ri-arrow-right-s-line text-gray-400 group-hover:text-sky-500 text-lg flex-shrink-0"></i>
            </Link>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
