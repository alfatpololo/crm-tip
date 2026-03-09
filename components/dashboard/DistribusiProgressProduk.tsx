'use client';

import { useState, useEffect } from 'react';
import { useProducts } from '@/lib/useTeamAndProducts';
import { loadProgressProduk, formatRevenue, type ProgressProdukMap, type ProductProgress } from '@/lib/progressProduk';

const METRICS = [
  { key: 'targetRegister', label: 'Target Register' },
  { key: 'newCustomer', label: 'New Customer' },
  { key: 'repeatCustomer', label: 'Repeat Customer' },
  { key: 'revenue', label: 'Revenue', format: (v: number) => formatRevenue(v) },
] as const;

const ICON_COLOR_BY_KEY: Record<string, { icon: string; bg: string; text: string }> = {
  mkasir_fb: { icon: 'ri-restaurant-line', bg: 'bg-amber-100', text: 'text-amber-700' },
  mkasir_persewaan: { icon: 'ri-home-4-line', bg: 'bg-sky-100', text: 'text-sky-700' },
  mkasir_retail: { icon: 'ri-store-2-line', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  disiplinku: { icon: 'ri-user-team-line', bg: 'bg-violet-100', text: 'text-violet-700' },
};

function ProductCard({ productKey, name, data }: { productKey: string; name: string; data: ProductProgress }) {
  const style = ICON_COLOR_BY_KEY[productKey] ?? { icon: 'ri-box-3-line', bg: 'bg-gray-100', text: 'text-gray-700' };
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className={`px-4 py-3 border-b border-gray-100 flex items-center gap-3 ${style.bg}`}>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${style.bg} ${style.text}`}>
          <i className={`${style.icon} text-xl`}></i>
        </div>
        <h3 className="font-semibold text-gray-900">{name}</h3>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {METRICS.map((m) => {
          const val = data[m.key as keyof ProductProgress];
          const num = typeof val === 'number' ? val : 0;
          const display = m.format ? m.format(num) : num > 0 ? String(num) : '–';
          return (
            <div key={m.key} className="flex flex-col">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{m.label}</span>
              <span className="text-sm font-semibold text-gray-900 tabular-nums mt-0.5">{display}</span>
            </div>
          );
        })}
      </div>
      {data.byPic && Object.keys(data.byPic).length > 0 && (
        <div className="px-4 pb-4 pt-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Per PIC</p>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {Object.entries(data.byPic).map(([pic, row]) => (
              <div key={pic} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50 text-sm">
                <span className="font-medium text-gray-700">{pic}</span>
                <span className="text-gray-600 tabular-nums">
                  TR {row.targetRegister} · NC {row.newCustomer} · Rp {(row.revenue / 1_000_000).toFixed(1)}jt
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DistribusiProgressProduk() {
  const { products } = useProducts();
  const [progress, setProgress] = useState<ProgressProdukMap>({});

  useEffect(() => {
    setProgress(loadProgressProduk());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setProgress(loadProgressProduk()), 4000);
    return () => clearInterval(interval);
  }, []);

  const productList = products.length > 0 ? products : [
    { id: '1', key: 'mkasir_fb', name: 'MKASIR F&B', sort_order: 1 },
    { id: '2', key: 'mkasir_persewaan', name: 'MKASIR Persewaan', sort_order: 2 },
    { id: '3', key: 'mkasir_retail', name: 'MKASIR Retail', sort_order: 3 },
    { id: '4', key: 'disiplinku', name: 'DISIPLINKU', sort_order: 4 },
  ].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden border-l-4 border-l-indigo-500">
      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50/80 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <i className="ri-pie-chart-2-line text-xl text-indigo-600"></i>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Distribusi Progress Produk per PIC</h3>
            <p className="text-xs text-gray-600 mt-0.5">Target Register, New Customer, Repeat Customer, Revenue per produk</p>
          </div>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {productList.map((p) => (
          <ProductCard
            key={p.id}
            productKey={p.key}
            name={p.name}
            data={progress[p.key] ?? { targetRegister: 0, newCustomer: 0, repeatCustomer: 0, revenue: 0 }}
          />
        ))}
      </div>
    </div>
  );
}
