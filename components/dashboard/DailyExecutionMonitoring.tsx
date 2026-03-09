'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { LAPORAN_STORAGE_KEY } from '@/components/marketing/InputLaporanPekerjaan';
import type { LaporanPekerjaan } from '@/components/marketing/InputLaporanPekerjaan';
import { useTeamMembers } from '@/lib/useTeamAndProducts';

function chanelDisplay(label: string): string {
  if (!label) return '–';
  return label.replace(/^(I{1,3}|IV|VI{0,3}|IX|XI{0,3})\.?\s*/i, '').trim() || label;
}

export default function DailyExecutionMonitoring() {
  const { users } = useTeamMembers();
  const [hydrated, setHydrated] = useState(false);
  const [laporan, setLaporan] = useState<LaporanPekerjaan[]>([]);

  const picList = useMemo(() => {
    const names = users.map((u) => u.email.split('@')[0]?.charAt(0).toUpperCase() + (u.email.split('@')[0]?.slice(1) ?? '')).filter(Boolean);
    return names.length > 0 ? names : ['Alfath', 'Nina', 'Ilham', 'Roby', 'Radi', 'Jemi'];
  }, [users]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const raw = localStorage.getItem(LAPORAN_STORAGE_KEY);
      setLaporan(raw ? JSON.parse(raw) : []);
    } catch {
      setLaporan([]);
    }
    const interval = setInterval(() => {
      try {
        const raw = localStorage.getItem(LAPORAN_STORAGE_KEY);
        setLaporan(raw ? JSON.parse(raw) : []);
      } catch {
        setLaporan([]);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [hydrated]);

  const { byProductPic, detailList } = useMemo(() => {
    const byProductPic: Record<string, Record<string, { target: number; realisasi: number }>> = {
      MKASIR: {},
      DISIPLINKU: {},
    };
    const detailList: { pic: string; activityLabel: string; chanel: string; target: string; realisasi: string; product: string }[] = [];
    if (!hydrated) return { byProductPic, detailList };

    const sorted = [...laporan].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    sorted.forEach((lp) => {
      const product = (lp as unknown as { product?: string }).product ?? (lp.sectionLabel?.toLowerCase().includes('disiplinku') ? 'DISIPLINKU' : 'MKASIR');
      const pic = lp.pic?.trim() || '–';
      if (!byProductPic[product]) byProductPic[product] = {};
      if (!byProductPic[product][pic]) byProductPic[product][pic] = { target: 0, realisasi: 0 };
      byProductPic[product][pic].realisasi += lp.realisasi;
      byProductPic[product][pic].target += 0;
      detailList.push({
        pic,
        activityLabel: lp.activityLabel || lp.sectionLabel || '–',
        chanel: chanelDisplay(lp.sectionLabel || ''),
        target: '–',
        realisasi: `${lp.realisasi} ${lp.satuan || ''}`.trim(),
        product,
      });
    });
    return { byProductPic, detailList: detailList.slice(0, 20) };
  }, [hydrated, laporan]);

  if (!hydrated) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden border-l-4 border-l-violet-500">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50/80 to-white">
          <h3 className="text-base font-bold text-gray-900">Daily Execution Monitoring</h3>
          <p className="text-xs text-gray-600 mt-0.5">KPI per produk per orang, detail aktivitas</p>
        </div>
        <div className="p-4 text-sm text-gray-500">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden border-l-4 border-l-violet-500">
      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50/80 to-white">
        <h3 className="text-base font-bold text-gray-900">Daily Execution Monitoring</h3>
        <p className="text-xs text-gray-600 mt-0.5">KPI per produk per orang, detail aktivitas (Chanel)</p>
      </div>
      <div className="p-4 space-y-6">
        {/* Ringkasan per produk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['MKASIR', 'DISIPLINKU'].map((product) => {
            const byPic = byProductPic[product] ?? {};
            const totalRealisasi = Object.values(byPic).reduce((s, x) => s + x.realisasi, 0);
            const totalTarget = Object.values(byPic).reduce((s, x) => s + x.target, 0);
            const pct = totalTarget > 0 ? Math.round((totalRealisasi / totalTarget) * 100) : null;
            return (
              <div key={product} className="rounded-xl border border-gray-200 p-3 bg-gray-50/50">
                <div className="font-semibold text-gray-900 mb-2">{product}</div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Realisasi: {totalRealisasi}</span>
                  <span className="text-gray-500">| Target: {totalTarget || '–'}</span>
                  {pct != null && (
                    <span className={pct >= 100 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {pct}%
                    </span>
                  )}
                  {pct != null && (pct >= 100 ? <i className="ri-checkbox-circle-fill text-green-500"></i> : <i className="ri-close-circle-fill text-red-500"></i>)}
                </div>
                <div className="mt-2 space-y-1">
                  {picList.map((pic) => {
                    const row = byPic[pic];
                    if (!row) return null;
                    const rPct = row.target > 0 ? Math.round((row.realisasi / row.target) * 100) : null;
                    return (
                      <div key={pic} className="flex items-center justify-between text-xs py-0.5">
                        <span className="text-gray-700">{pic}</span>
                        <span className="tabular-nums text-gray-600">
                          {row.realisasi} / {row.target || '–'}
                          {rPct != null && (
                            <span className={rPct >= 100 ? ' text-green-600 ml-1' : ' text-red-600 ml-1'}>({rPct}%)</span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabel detail aktivitas */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Detail aktivitas</h4>
          <div className="overflow-x-auto max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-2 px-2 font-medium text-gray-600">Nama</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-600">Chanel</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-600">Aktivitas</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-600">Realisasi</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-600">Produk</th>
                </tr>
              </thead>
              <tbody>
                {detailList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-500">
                      Belum ada data. Input di <Link href="/execution/input-task-kpi" className="text-indigo-600 hover:underline">Input Task KPI</Link>.
                    </td>
                  </tr>
                ) : (
                  detailList.map((row, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50/50">
                      <td className="py-2 px-2 font-medium text-gray-900">{row.pic}</td>
                      <td className="py-2 px-2 text-gray-600">{row.chanel}</td>
                      <td className="py-2 px-2 text-gray-700 line-clamp-2">{row.activityLabel}</td>
                      <td className="py-2 px-2"><span className="font-medium text-emerald-700">{row.realisasi}</span></td>
                      <td className="py-2 px-2 text-gray-600">{row.product}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
