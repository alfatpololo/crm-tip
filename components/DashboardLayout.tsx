'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#f8fafc] min-h-screen" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.06) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.04) 0%, transparent 45%)' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}