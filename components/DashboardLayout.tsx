'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuth } from '@/contexts/AuthContext';

const COORDINATOR_ONLY_PATHS = ['/execution/activities', '/execution/leads', '/execution/input-task-kpi', '/execution/laporan-kpi'];
const SUPERADMIN_ONLY_PATHS = ['/management/kelola-user', '/management/kelola-produk'];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, authMode, role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const requireAuth = authMode === 'supabase';
  const isStaff = role === 'staff' || role === 'sales_officer';
  const isSuperadmin = role === 'superadmin';

  useEffect(() => {
    if (loading || pathname === '/login' || pathname === '/register') return;
    if (requireAuth && !user) {
      router.replace('/login');
      return;
    }
    if (requireAuth && user && pathname === '/') {
      if (isSuperadmin) router.replace('/management/kelola-user');
      else router.replace('/execution/tasks');
      return;
    }
    const isAdminPath = SUPERADMIN_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
    if (requireAuth && user && isAdminPath && !isSuperadmin) {
      router.replace('/');
      return;
    }
    if (requireAuth && user && isStaff) {
      const isCoordOnly = COORDINATOR_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
      if (isCoordOnly) router.replace('/execution/tasks');
    }
  }, [user, loading, router, pathname, requireAuth, isStaff, isSuperadmin]);

  if (requireAuth && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-500 flex items-center gap-2">
          <i className="ri-loader-4-line animate-spin text-2xl"></i>
          Memuat...
        </div>
      </div>
    );
  }
  if (requireAuth && !user) return null;

  if (requireAuth && user && SUPERADMIN_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/')) && !isSuperadmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-500 flex items-center gap-2">
          <i className="ri-loader-4-line animate-spin text-2xl"></i>
          Mengalihkan...
        </div>
      </div>
    );
  }
  const isCoordOnlyPath = COORDINATOR_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'));
  if (requireAuth && user && isStaff && isCoordOnlyPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-500 flex items-center gap-2">
          <i className="ri-loader-4-line animate-spin text-2xl"></i>
          Mengalihkan...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] min-h-screen" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.06) 0%, transparent 50%)' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
