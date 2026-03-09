'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTeamMembers, teamMemberDisplay } from '@/lib/useTeamAndProducts';
import { loadTasksFromStorage } from '@/lib/tasksData';
import { supabase } from '@/lib/supabase/client';

function samePic(a: string, b: string): boolean {
  return (a || '').trim().toLowerCase() === (b || '').trim().toLowerCase();
}

export default function StaffTaskWidget() {
  const { user, role } = useAuth();
  const { users } = useTeamMembers();
  const [tasks, setTasks] = useState<ReturnType<typeof loadTasksFromStorage>>([]);

  const myDisplayName = useMemo(() => {
    if (!user?.email) return '';
    const fromTeam = users.find((u) => u.email?.toLowerCase() === user.email?.toLowerCase());
    if (fromTeam) return teamMemberDisplay(fromTeam);
    const local = (user.email || '').split('@')[0] || '';
    return local.charAt(0).toUpperCase() + local.slice(1).toLowerCase();
  }, [user?.email, users]);

  const isStaff = role === 'staff' || role === 'sales_officer';

  const loadTasks = useCallback(async () => {
    if (!isStaff) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/tasks', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const json = await res.json();
      if (res.ok && Array.isArray(json.tasks)) {
        setTasks(json.tasks.length > 0 ? json.tasks : []);
        return;
      }
    } catch (_) {}
    setTasks(loadTasksFromStorage());
  }, [isStaff]);

  useEffect(() => {
    loadTasks();
    const interval = setInterval(loadTasks, 4000);
    return () => clearInterval(interval);
  }, [loadTasks]);

  const myTasks = useMemo(() => tasks.filter((t) => samePic(t.pic, myDisplayName)), [tasks, myDisplayName]);
  const pending = myTasks.filter((t) => t.status === 'pending' || t.status === 'overdue').length;
  const done = myTasks.filter((t) => t.status === 'done').length;

  if (!isStaff) return null;

  return (
    <Link
      href="/execution/tasks"
      className="block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden border-l-4 border-l-amber-500 hover:shadow-md transition-shadow"
    >
      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50/80 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <i className="ri-task-line text-xl text-amber-600"></i>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Tugas Saya</h3>
            <p className="text-xs text-gray-600 mt-0.5">Tugas yang ditugaskan koordinator ke Anda</p>
          </div>
        </div>
      </div>
      <div className="p-4 flex gap-4">
        <div className="flex-1 text-center">
          <p className="text-2xl font-bold text-amber-600">{pending}</p>
          <p className="text-xs text-gray-500">Menunggu</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-2xl font-bold text-green-600">{done}</p>
          <p className="text-xs text-gray-500">Selesai</p>
        </div>
      </div>
      <div className="px-4 pb-4">
        <span className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
          Lihat & update progress <i className="ri-arrow-right-s-line"></i>
        </span>
      </div>
    </Link>
  );
}
