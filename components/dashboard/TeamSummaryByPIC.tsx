'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LAPORAN_STORAGE_KEY } from '@/components/marketing/InputLaporanPekerjaan';
import type { LaporanPekerjaan } from '@/components/marketing/InputLaporanPekerjaan';
import { loadTasksFromStorage, type TaskRecord } from '@/lib/tasksData';
import { PIC_OPTIONS } from '@/lib/leadsData';

const INITIALS: Record<string, string> = {
  Alfath: 'AF',
  Nina: 'NA',
  Ilham: 'IH',
  Roby: 'RB',
  Radi: 'RD',
  Jemi: 'JM',
};

const AVATAR_COLORS = [
  'from-indigo-500 to-violet-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
  'from-sky-500 to-blue-500',
  'from-violet-500 to-purple-500',
];

export default function TeamSummaryByPIC() {
  const [laporan, setLaporan] = useState<LaporanPekerjaan[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(LAPORAN_STORAGE_KEY) : null;
      setLaporan(raw ? JSON.parse(raw) : []);
    } catch {
      setLaporan([]);
    }
    setTasks(loadTasksFromStorage());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const raw = localStorage.getItem(LAPORAN_STORAGE_KEY);
        setLaporan(raw ? JSON.parse(raw) : []);
      } catch {
        setLaporan([]);
      }
      setTasks(loadTasksFromStorage());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);
  const laporanMingguIni = laporan.filter((lp) => {
    try {
      const d = new Date(lp.tanggal);
      return d >= startOfWeek && d <= now;
    } catch {
      return false;
    }
  });
  const pendingTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'overdue');

  const byPic: Record<string, { laporanCount: number; pendingTasks: number }> = {};
  PIC_OPTIONS.forEach((name) => {
    byPic[name] = {
      laporanCount: laporanMingguIni.filter((lp) => lp.pic === name).length,
      pendingTasks: pendingTasks.filter((t) => t.pic === name).length,
    };
  });

  return (
    <div className="flex flex-col max-h-[320px] bg-white rounded-2xl border border-gray-200/90 shadow-md shadow-gray-200/40 overflow-hidden border-l-4 border-l-indigo-500">
      <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50/80 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center ring-2 ring-white/80 shadow-sm">
            <i className="ri-user-star-line text-xl text-indigo-600"></i>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 tracking-tight">Tim per PIC</h3>
            <p className="text-xs text-gray-600 mt-0.5">7 hari · laporan & tugas</p>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 flex flex-col p-3">
        <ul className="space-y-1.5 overflow-y-auto min-h-0 pr-1">
          {PIC_OPTIONS.map((name, i) => {
            const { laporanCount, pendingTasks: p } = byPic[name] || { laporanCount: 0, pendingTasks: 0 };
            const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <li
                key={name}
                className="flex items-center gap-3 py-2 px-2.5 rounded-lg hover:bg-gray-50/80 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-xs font-bold shadow-sm flex-shrink-0`}
                >
                  {INITIALS[name] || name.slice(0, 2)}
                </div>
                <span className="font-medium text-gray-900 flex-1 min-w-0 truncate text-sm">{name}</span>
                <div className="flex items-center gap-2 flex-shrink-0 text-xs">
                  <span className="font-bold tabular-nums text-emerald-600">{laporanCount}</span>
                  <span className="text-gray-400">·</span>
                  <span className="font-bold tabular-nums text-amber-600">{p}</span>
                  <span className="text-gray-500">tugas</span>
                </div>
              </li>
            );
          })}
        </ul>
        <Link
          href="/execution/activities"
          className="flex-shrink-0 mt-3 flex items-center justify-center gap-1 py-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 rounded-lg hover:bg-indigo-50/80 transition-colors"
        >
          KPI per orang <i className="ri-arrow-right-s-line"></i>
        </Link>
      </div>
    </div>
  );
}
