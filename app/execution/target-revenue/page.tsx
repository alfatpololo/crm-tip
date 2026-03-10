'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';

const PRODUCTS = [
  { key: 'mkasir_fnb', label: 'MKASIR F&B' },
  { key: 'mkasir_persewaan', label: 'MKASIR Persewaan' },
  { key: 'mkasir_retail', label: 'MKASIR Retail' },
  { key: 'disiplinku', label: 'DISIPLINKU' },
] as const;

// Data dummy: tahun 2024 & 2025
const DUMMY_TARGET: Record<string, Record<number, number>> = {
  mkasir_fnb: { 2025: 2500000000, 2024: 2100000000 },
  mkasir_persewaan: { 2025: 1800000000, 2024: 1500000000 },
  mkasir_retail: { 2025: 1200000000, 2024: 980000000 },
  disiplinku: { 2025: 900000000, 2024: 750000000 },
};

function formatNum(n: number) {
  if (n >= 1e9) return `Rp ${(n / 1e9).toFixed(1)}M`;
  if (n >= 1e6) return `Rp ${(n / 1e6).toFixed(0)}jt`;
  if (n >= 1e3) return `Rp ${(n / 1e3).toFixed(0)}rb`;
  return `Rp ${n}`;
}

export default function TargetRevenuePage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const years = [year, year - 1];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero title="Target Revenue" subtitle="Target revenue per produk. Bisa lihat tahun lalu." badge={{ icon: 'ri-money-dollar-circle-line', text: 'Revenue' }} variant="emerald" />
        <PageCard accent="emerald" icon="ri-money-dollar-circle-line" title="Target per Produk">
          <div className="flex flex-wrap gap-4 mb-6">
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Tahun</span>
              <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                {[new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Produk</th>
                  {years.map((y) => (
                    <th key={y} className="text-right py-3 px-4 font-semibold text-gray-700">{y}{y === year ? '' : ' (tahun lalu)'}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map((p) => (
                  <tr key={p.key} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-gray-900">{p.label}</td>
                    {years.map((y) => (
                      <td key={y} className="py-3 px-4 text-right tabular-nums text-gray-700">
                        {formatNum(DUMMY_TARGET[p.key]?.[y] ?? 0)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageCard>
      </div>
    </DashboardLayout>
  );
}
