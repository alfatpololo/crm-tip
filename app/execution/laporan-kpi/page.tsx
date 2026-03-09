'use client';

import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import { LAPORAN_STORAGE_KEY } from '@/components/marketing/InputLaporanPekerjaan';
import type { LaporanPekerjaan } from '@/components/marketing/InputLaporanPekerjaan';
import { useTeamMembers, teamMemberDisplay, useProducts } from '@/lib/useTeamAndProducts';

function chanelDisplay(s: string): string {
  return (s || '').replace(/^(I{1,3}|IV|VI{0,3}|IX|XI{0,3})\.?\s*/i, '').trim() || s || '–';
}

export default function LaporanKPIPage() {
  const { users } = useTeamMembers();
  const { products } = useProducts();
  const [laporan, setLaporan] = useState<LaporanPekerjaan[]>([]);

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(LAPORAN_STORAGE_KEY) : null;
      setLaporan(raw ? JSON.parse(raw) : []);
    } catch {
      setLaporan([]);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const raw = localStorage.getItem(LAPORAN_STORAGE_KEY);
        setLaporan(raw ? JSON.parse(raw) : []);
      } catch {
        setLaporan([]);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const picList = useMemo(() => {
    const names = users.map((u) => teamMemberDisplay(u));
    return names.length > 0 ? names : ['Alfath', 'Nina', 'Ilham', 'Roby', 'Radi', 'Jemi'];
  }, [users]);

  const byPic = useMemo(() => {
    const out: Record<string, number> = {};
    picList.forEach((p) => { out[p] = 0; });
    laporan.forEach((lp) => {
      const pic = lp.pic?.trim() || '–';
      out[pic] = (out[pic] ?? 0) + lp.realisasi;
    });
    return out;
  }, [laporan, picList]);

  const byProduct = useMemo(() => {
    const out: Record<string, number> = {};
    (products.length ? products.map((p) => p.name) : ['MKASIR', 'DISIPLINKU']).forEach((name) => { out[name] = 0; });
    laporan.forEach((lp) => {
      const product = (lp as unknown as { product?: string }).product ?? (lp.sectionLabel?.toLowerCase().includes('disiplinku') ? 'DISIPLINKU' : 'MKASIR');
      out[product] = (out[product] ?? 0) + lp.realisasi;
    });
    return out;
  }, [laporan, products]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          title="Laporan KPI"
          subtitle="Ringkasan KPI per orang dan per produk dari input task KPI."
          badge={{ icon: 'ri-file-chart-line', text: 'Laporan' }}
          variant="violet"
        />

        <PageCard accent="blue" icon="ri-user-line" title="KPI per Orang">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="text-left py-3 px-4 font-medium">PIC</th>
                  <th className="text-right py-3 px-4 font-medium">Total Realisasi</th>
                </tr>
              </thead>
              <tbody>
                {picList.map((pic) => (
                  <tr key={pic} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-2.5 px-4 font-medium text-gray-900">{pic}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-gray-700">{byPic[pic] ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageCard>

        <PageCard accent="emerald" icon="ri-box-3-line" title="KPI per Produk">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="text-left py-3 px-4 font-medium">Produk</th>
                  <th className="text-right py-3 px-4 font-medium">Total Realisasi</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(byProduct).map(([name, total]) => (
                  <tr key={name} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-2.5 px-4 font-medium text-gray-900">{name}</td>
                    <td className="py-2.5 px-4 text-right tabular-nums text-gray-700">{total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageCard>

        <PageCard accent="slate" icon="ri-file-list-3-line" title="Detail Laporan Terkini">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-2 px-2 font-medium text-gray-600">Tanggal</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-600">PIC</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-600">Chanel</th>
                  <th className="text-left py-2 px-2 font-medium text-gray-600">Aktivitas</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-600">Realisasi</th>
                </tr>
              </thead>
              <tbody>
                {[...laporan]
                  .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                  .slice(0, 50)
                  .map((lp) => (
                    <tr key={lp.id} className="border-t border-gray-100 hover:bg-gray-50/50">
                      <td className="py-2 px-2 text-gray-700">{lp.tanggal}</td>
                      <td className="py-2 px-2 font-medium text-gray-900">{lp.pic}</td>
                      <td className="py-2 px-2 text-gray-600">{chanelDisplay(lp.sectionLabel)}</td>
                      <td className="py-2 px-2 text-gray-700">{lp.activityLabel || lp.sectionLabel}</td>
                      <td className="py-2 px-2 text-right tabular-nums text-emerald-700 font-medium">{lp.realisasi} {lp.satuan}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {laporan.length === 0 && (
            <p className="py-8 text-center text-gray-500 text-sm">Belum ada data. Input di halaman Input Task KPI.</p>
          )}
        </PageCard>
      </div>
    </DashboardLayout>
  );
}
