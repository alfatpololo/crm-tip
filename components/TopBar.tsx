'use client';

import { useAuth } from '@/contexts/AuthContext';

const roleLabels: Record<string, string> = {
  superadmin: 'Superadmin',
  koordinator: 'Koordinator',
  management: 'Management',
  sales_officer: 'Sales Officer',
  staff: 'Staff',
};

export default function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, role, signOut } = useAuth();
  const displayName = user?.email ? user.email.split('@')[0] : 'User';
  const initial = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="h-16 bg-white/90 backdrop-blur-sm border-b border-gray-200/80 flex items-center justify-between px-6 shadow-sm shadow-gray-100">
      <button
        onClick={onMenuClick}
        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer text-gray-600"
      >
        <i className="ri-menu-line text-xl w-5 h-5 flex items-center justify-center"></i>
      </button>

      <div className="flex-1 max-w-xl mx-4">
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg w-5 h-5 flex items-center justify-center"></i>
          <input
            type="text"
            placeholder="Cari leads, aktivitas, atau laporan..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:border-indigo-300 bg-gray-50/80 focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-3 ml-2 pl-3 border-l border-gray-200/80">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md shadow-indigo-200/50">
            {initial}
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium text-gray-900">{user?.email ?? displayName}</div>
            <div className="text-xs text-gray-500">{roleLabels[role] ?? role}</div>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="p-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer text-gray-500"
          title="Keluar"
        >
          <i className="ri-logout-box-r-line text-xl w-5 h-5 flex items-center justify-center"></i>
        </button>
      </div>
    </header>
  );
}
