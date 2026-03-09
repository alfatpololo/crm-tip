'use client';

import { useState, useEffect, useMemo } from 'react';
import { LAPORAN_STORAGE_KEY } from '@/components/marketing/InputLaporanPekerjaan';
import type { LaporanPekerjaan } from '@/components/marketing/InputLaporanPekerjaan';
import { useTeamMembers } from '@/lib/useTeamAndProducts';

const SECTIONS = [
  { id: 'idigital', label: 'I. Digital' },
  { id: 'iikomunitas', label: 'II. Komunitas' },
  { id: 'iiicanvassing', label: 'III. Canvassing' },
  { id: 'ivcustomer', label: 'IV. Customer' },
];

function normalizeSectionLabel(s: string): string {
  const lower = (s || '').toLowerCase();
  if (lower.includes('digital')) return 'I. Digital';
  if (lower.includes('komunitas')) return 'II. Komunitas';
  if (lower.includes('canvassing')) return 'III. Canvassing';
  if (lower.includes('customer')) return 'IV. Customer';
  return s || '–';
}

export default function KontrolKPIAktivitas() {
  const { users } = useTeamMembers();
  const [hydrated, setHydrated] = useState(false);
  const [laporan, setLaporan] = useState<LaporanPekerjaan[]>([]);

  const picList = useMemo(() => {
    const byEmail = new Map<string, string>();
    users.forEach((u) => byEmail.set(u.email.toLowerCase(), u.email.split('@')[0]?.charAt(0).toUpperCase() + (u.email.split('@')[0]?.slice(1) ?? '')));
    const names = Array.from(byEmail.values()).filter(Boolean);
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

  const grid = useMemo(() => {
    const byPic: Record<string, Record<string, number>> = {};
    const totals: Record<string, number> = {};
    SECTIONS.forEach((s) => { totals[s.label] = 0; });
    picList.forEach((pic) => { byPic[pic] = { 'I. Digital': 0, 'II. Komunitas': 0, 'III. Canvassing': 0, 'IV. Customer': 0 }; });

    if (hydrated && laporan.length > 0) {
      laporan.forEach((lp) => {
        const section = normalizeSectionLabel(lp.sectionLabel);
        const pic = lp.pic?.trim() || '–';
        if (!byPic[pic]) byPic[pic] = { 'I. Digital': 0, 'II. Komunitas': 0, 'III. Canvassing': 0, 'IV. Customer': 0 };
        byPic[pic][section] = (byPic[pic][section] || 0) + lp.realisasi;
        if (totals[section] !== undefined) totals[section] += lp.realisasi;
      });
    }
    return { byPic, totals };
  }, [hydrated, laporan, picList]);

  if (!hydrated) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden border-l-4 border-l-emerald-500">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50/80 to-white">
          <h3 className="text-base font-bold text-gray-900">Kontrol KPI Aktivitas</h3>
          <p className="text-xs text-gray-600 mt-0.5">Aktivitas horizontal, PIC vertikal</p>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="text-left py-3 px-2 font-medium">PIC</th>
                  {SECTIONS.map((s) => <th key={s.id} className="text-right py-3 px-2 font-medium">{s.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {picList.map((pic) => (
                  <tr key={pic} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-2.5 px-2 font-medium text-gray-900">{pic}</td>
                    {SECTIONS.map((s) => <td key={s.id} className="py-2.5 px-2 text-right tabular-nums text-gray-700">0</td>)}
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="py-2.5 px-2 text-gray-900">Total</td>
                  {SECTIONS.map((s) => <td key={s.id} className="py-2.5 px-2 text-right tabular-nums text-gray-900">0</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden border-l-4 border-l-emerald-500">
      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50/80 to-white">
        <h3 className="text-base font-bold text-gray-900">Kontrol KPI Aktivitas</h3>
        <p className="text-xs text-gray-600 mt-0.5">Aktivitas horizontal, PIC vertikal</p>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-3 px-2 font-medium">PIC</th>
                {SECTIONS.map((s) => <th key={s.id} className="text-right py-3 px-2 font-medium">{s.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {picList.map((pic) => {
                const row = grid.byPic[pic];
                if (!row) return null;
                return (
                  <tr key={pic} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-2.5 px-2 font-medium text-gray-900">{pic}</td>
                    {SECTIONS.map((s) => (
                      <td key={s.id} className="py-2.5 px-2 text-right tabular-nums text-gray-700">{row[s.label] ?? 0}</td>
                    ))}
                  </tr>
                );
              })}
              <tr className="bg-gray-50 font-semibold">
                <td className="py-2.5 px-2 text-gray-900">Total</td>
                {SECTIONS.map((s) => (
                  <td key={s.id} className="py-2.5 px-2 text-right tabular-nums text-gray-900">{grid.totals[s.label] ?? 0}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
