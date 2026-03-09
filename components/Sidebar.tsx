'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

type NavItem = { name: string; href: string; icon: string };

const isCoordinatorRole = (role: string) => role === 'koordinator' || role === 'management';

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { role } = useAuth();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const coord = isCoordinatorRole(role);
  const isSuperadmin = role === 'superadmin';

  const navigation = useMemo(() => {
    if (isSuperadmin) {
      return [
        { section: 'ADMIN', items: [
          { name: 'Kelola User', href: '/management/kelola-user', icon: 'ri-user-settings-line' },
          { name: 'Kelola Produk', href: '/management/kelola-produk', icon: 'ri-box-3-line' },
        ] as NavItem[] },
      ];
    }
    const operasionalItems: NavItem[] = coord
      ? [
          { name: 'Tugas & Tindak Lanjut', href: '/execution/tasks', icon: 'ri-task-line' },
          { name: 'Caring', href: '/execution/caring', icon: 'ri-customer-service-2-line' },
          { name: 'Content Planner', href: '/execution/content-planner', icon: 'ri-calendar-event-line' },
        ]
      : [
          { name: 'Tugas & Tindak Lanjut', href: '/execution/tasks', icon: 'ri-task-line' },
          { name: 'Caring', href: '/execution/caring', icon: 'ri-customer-service-2-line' },
          { name: 'Content Planner', href: '/execution/content-planner', icon: 'ri-calendar-event-line' },
        ];
    return [
      { section: 'OPERASIONAL', items: operasionalItems },
    ];
  }, [coord, isSuperadmin]);

  useEffect(() => {
    navigation.forEach((item) => {
      if (item.section && 'items' in item && item.items) {
        const hasActive = item.items.some((sub) => pathname === sub.href || pathname.startsWith(sub.href + '/'));
        if (hasActive) setOpenSections((prev) => ({ ...prev, [item.section!]: true }));
      }
    });
  }, [pathname, navigation]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href + '/'));

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden" onClick={onClose} />
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
            if (item.section === null && 'href' in item && item.href) {
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2.5 mb-1 rounded-xl text-sm font-medium
                    ${isActive(item.href) ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white' : 'text-gray-700 hover:bg-gray-100'}
                  `}
                >
                  <i className={`${item.icon} text-lg w-6 flex items-center justify-center mr-3`}></i>
                  {item.name}
                </Link>
              );
            }
            if (item.section && 'items' in item && item.items) {
              const isOpenSection = openSections[item.section] !== false;
              return (
                <div key={index} className="mb-1">
                  <button
                    type="button"
                    onClick={() => toggleSection(item.section!)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 text-left"
                  >
                    <span className="uppercase tracking-wider text-xs font-bold text-blue-600">{item.section}</span>
                    <i className={`ri-arrow-down-s-line text-lg transition-transform ${isOpenSection ? 'rotate-0' : '-rotate-90'}`} />
                  </button>
                  <div className={`overflow-hidden transition-all ${isOpenSection ? 'max-h-[500px]' : 'max-h-0'}`}>
                    {item.items.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        onClick={() => typeof window !== 'undefined' && window.innerWidth < 1024 && onClose()}
                        className={`flex items-center pl-8 pr-3 py-2 rounded-lg text-sm border-l-2 border-transparent
                          ${isActive(subItem.href) ? 'bg-indigo-50 text-indigo-700 border-l-indigo-500' : 'text-gray-700 hover:bg-gray-50 border-l-gray-100'}`}
                      >
                        <i className={`${subItem.icon} text-base w-5 mr-2.5 flex-shrink-0`}></i>
                        <span className="truncate">{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </nav>
      </aside>
    </>
  );
}
