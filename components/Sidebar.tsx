'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

type NavItem = { name: string; href: string; icon: string };
type NavSection = { section: string; items: NavItem[] };

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // ANALITIK EKSEKUTIF & MANAJEMEN sementara disembunyikan (umpetin)
  const showAnalitik = false;
  const showManajemen = false;

  const navigation: { name?: string; href?: string; icon?: string; section: string | null; items?: NavItem[] }[] = [
    { name: 'Ringkasan Dashboard', href: '/', icon: 'ri-dashboard-line', section: null },
    { section: 'OPERASIONAL', items: [
      { name: 'Leads', href: '/execution/leads', icon: 'ri-user-add-line' },
      { name: 'Aktivitas', href: '/execution/activities', icon: 'ri-calendar-check-line' },
      { name: 'Sumber Saluran', href: '/execution/channels', icon: 'ri-share-line' },
      { name: 'Kategori Produk', href: '/execution/products', icon: 'ri-box-3-line' },
      { name: 'Tugas & Tindak Lanjut', href: '/execution/tasks', icon: 'ri-task-line' },
    ]},
    { section: 'INTI KONTROL (CRM)', items: [
      { name: 'Papan Pipeline', href: '/crm/pipeline', icon: 'ri-kanban-view' },
      { name: 'Detail Lead', href: '/crm/lead-details', icon: 'ri-file-list-3-line' },
      { name: 'Performa Penjualan', href: '/crm/performance', icon: 'ri-line-chart-line' },
      { name: 'Peramalan', href: '/crm/forecasting', icon: 'ri-funds-line' },
    ]},
    ...(showAnalitik ? [{ section: 'ANALITIK EKSEKUTIF', items: [
      { name: 'Dashboard KPI', href: '/analytics/kpi', icon: 'ri-bar-chart-box-line' },
      { name: 'Corong Konversi', href: '/analytics/funnel', icon: 'ri-filter-3-line' },
      { name: 'Analitik Pendapatan', href: '/analytics/revenue', icon: 'ri-money-dollar-circle-line' },
      { name: 'Churn & Retensi', href: '/analytics/retention', icon: 'ri-user-follow-line' },
      { name: 'CAC vs LTV', href: '/analytics/cac-ltv', icon: 'ri-scales-3-line' },
    ]}] : []),
    ...(showManajemen ? [{ section: 'MANAJEMEN', items: [
      { name: 'Peran Pengguna', href: '/management/roles', icon: 'ri-shield-user-line' },
      { name: 'Pengaturan KPI', href: '/management/kpi-settings', icon: 'ri-settings-3-line' },
      { name: 'Data Master Aktivitas', href: '/management/master-data', icon: 'ri-database-2-line' },
      { name: 'Ekspor Laporan', href: '/management/reports', icon: 'ri-file-download-line' },
    ]}] : []),
  ];

  // Saat pindah halaman, pastikan section yang berisi halaman aktif terbuka
  useEffect(() => {
    navigation.forEach((item) => {
      if (item.section && item.items) {
        const hasActive = item.items.some((sub) => pathname === sub.href || pathname.startsWith(sub.href + '/'));
        if (hasActive) setOpenSections((prev) => ({ ...prev, [item.section!]: true }));
      }
    });
  }, [pathname]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href + '/'));

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white/95 backdrop-blur-sm border-r border-gray-200/80
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col shadow-xl shadow-gray-200/30 lg:shadow-none
      `}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200/80 shrink-0 bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/50">
          <Image
            src="https://static.readdy.ai/image/882211b220e3f4e1a588d98e931d4923/704ad672474b81ce928e7b53c18ecbb5.png"
            alt="TIP Marketing"
            width={120}
            height={40}
            className="h-8 w-auto"
          />
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {navigation.map((item, index) => {
            if (item.section === null && item.href) {
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2.5 mb-1 rounded-xl text-sm font-medium
                    transition-all whitespace-nowrap
                    ${isActive(item.href) ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200/50' : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-violet-50'}
                  `}
                >
                  <i className={`${item.icon} text-lg w-6 flex items-center justify-center mr-3 ${isActive(item.href) ? 'text-white' : 'text-gray-500'}`}></i>
                  {item.name}
                </Link>
              );
            }

            if (!item.section || !item.items) return null;

            const sectionColors = ['text-blue-600', 'text-emerald-600', 'text-amber-600', 'text-rose-600'];
            const sectionColor = sectionColors[index % sectionColors.length];
            const isOpen = openSections[item.section] !== false;

            return (
              <div key={index} className="mb-1">
                <button
                  type="button"
                  onClick={() => toggleSection(item.section!)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50/80 transition-colors text-left"
                >
                  <span className={`uppercase tracking-wider text-xs font-bold ${sectionColor}`}>
                    {item.section}
                  </span>
                  <i
                    className={`ri-arrow-down-s-line text-lg text-gray-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  {item.items.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      onClick={() => typeof window !== 'undefined' && window.innerWidth < 1024 && onClose()}
                      className={`
                        flex items-center pl-8 pr-3 py-2 rounded-lg text-sm font-medium
                        transition-all whitespace-nowrap border-l-2 border-transparent
                        ${isActive(subItem.href)
                          ? 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 border-l-indigo-500'
                          : 'text-gray-700 hover:bg-gray-50/80 border-l-gray-100'
                        }
                      `}
                    >
                      <i
                        className={`${subItem.icon} text-base w-5 flex items-center justify-center mr-2.5 flex-shrink-0 ${
                          isActive(subItem.href) ? 'text-indigo-600' : 'text-gray-400'
                        }`}
                      />
                      <span className="truncate">{subItem.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}