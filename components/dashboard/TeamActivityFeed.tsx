'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LAPORAN_STORAGE_KEY } from '@/components/marketing/InputLaporanPekerjaan';
import type { LaporanPekerjaan } from '@/components/marketing/InputLaporanPekerjaan';

const MAX_ITEMS = 12;

function formatDate(s: string) {
  try {
    const d = new Date(s);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    if (isToday) return 'Hari ini';
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Kemarin';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return s;
  }
}

export default function TeamActivityFeed() {
  const [items, setItems] = useState<LaporanPekerjaan[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(LAPORAN_STORAGE_KEY) : null;
      const list: LaporanPekerjaan[] = raw ? JSON.parse(raw) : [];
      const sorted = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setItems(sorted.slice(0, MAX_ITEMS));
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    const refresh = () => {
      try {
        const raw = localStorage.getItem(LAPORAN_STORAGE_KEY);
        const list: LaporanPekerjaan[] = raw ? JSON.parse(raw) : [];
        const sorted = [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setItems(sorted.slice(0, MAX_ITEMS));
      } catch {
        setItems([]);
      }
    };
    window.addEventListener('storage', refresh);
    const interval = setInterval(refresh, 4000);
    return () => {
      window.removeEventListener('storage', refresh);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-md shadow-gray-200/40 overflow-hidden border-l-4 border-l-emerald-500">
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50/80 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center ring-2 ring-white/80 shadow-sm">
              <i className="ri-team-line text-2xl text-emerald-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight">Aktivitas Tim Terkini</h3>
              <p className="text-sm text-gray-600 mt-0.5">Laporan pekerjaan yang baru di-input tim (realisasi aktivitas)</p>
            </div>
          </div>
          <Link
            href="/execution/activities"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 whitespace-nowrap"
          >
            Lihat semua <i className="ri-arrow-right-line"></i>
          </Link>
        </div>
      </div>
      <div className="p-4">
        {items.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-sm">
            <i className="ri-file-list-3-line text-3xl text-gray-300 block mb-2"></i>
            Belum ada laporan pekerjaan. Tim bisa input di halaman <Link href="/execution/activities" className="text-emerald-600 hover:underline">Aktivitas</Link>.
          </div>
        ) : (
          <ul className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {items.map((lp) => (
              <li
                key={lp.id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/80 border border-transparent hover:border-gray-100"
              >
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {lp.pic.slice(0, 2).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    <span className="text-emerald-700">{lp.pic}</span>
                    {' · '}
                    {lp.activityLabel || lp.sectionLabel}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {lp.sectionLabel} · Realisasi: <span className="font-semibold text-gray-700">{lp.realisasi}</span> {lp.satuan && `(${lp.satuan})`} · {formatDate(lp.tanggal)}
                  </p>
                  {lp.catatan && (
                    <p className="text-xs text-gray-600 mt-1 truncate" title={lp.catatan}>{lp.catatan}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
