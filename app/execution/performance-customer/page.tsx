'use client';

import { useState, useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';

const MONTHS = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function getWeekRanges(year: number, month: number) {
  const lastDay = new Date(year, month, 0).getDate();
  return [
    { range: '1–7', target: 120, totalCustomer: 115, newCustomer: 28, repeatCustomer: 82, churnCustomer: 5 },
    { range: '8–14', target: 125, totalCustomer: 122, newCustomer: 31, repeatCustomer: 88, churnCustomer: 4 },
    { range: '15–21', target: 130, totalCustomer: 128, newCustomer: 35, repeatCustomer: 90, churnCustomer: 6 },
    { range: `22–${lastDay}`, target: 128, totalCustomer: 131, newCustomer: 33, repeatCustomer: 95, churnCustomer: 3 },
  ];
}

function getCalendarDays(year: number, month: number) {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const startPad = first.getDay();
  const days: (number | null)[] = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(d);
  return days;
}

// Dummy data harian (contoh beberapa tanggal)
const DUMMY_DAILY: Record<string, { target: number; total: number; new: number; repeat: number; churn: number }> = {
  '15': { target: 18, total: 22, new: 5, repeat: 16, churn: 1 },
  '16': { target: 20, total: 19, new: 4, repeat: 14, churn: 2 },
  '17': { target: 19, total: 21, new: 6, repeat: 15, churn: 0 },
  '18': { target: 21, total: 23, new: 7, repeat: 15, churn: 1 },
  '22': { target: 17, total: 18, new: 3, repeat: 14, churn: 1 },
  '25': { target: 19, total: 20, new: 5, repeat: 15, churn: 0 },
};

export default function PerformanceCustomerPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const weekRanges = useMemo(() => getWeekRanges(year, month), [year, month]);
  const calendarDays = useMemo(() => getCalendarDays(year, month), [year, month]);
  const selectedDaily = selectedDate ? DUMMY_DAILY[String(selectedDate)] : null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero title="Performance Customer" subtitle="Target dan realisasi bulanan. Lihat harian lewat kalender." badge={{ icon: 'ri-user-star-line', text: 'Performance' }} variant="blue" />
        <PageCard accent="blue" icon="ri-user-star-line" title="Ringkasan Bulanan">
          <div className="flex flex-wrap gap-4 mb-6">
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Tahun</span>
              <select value={year} onChange={(e) => { setYear(Number(e.target.value)); setSelectedDate(null); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                {[now.getFullYear(), now.getFullYear() - 1].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Bulan</span>
              <select value={month} onChange={(e) => { setMonth(Number(e.target.value)); setSelectedDate(null); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                {MONTHS.slice(1).map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Periode</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Target</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Total Customer</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">New Customer</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Repeat Customer</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Churn Customer</th>
                </tr>
              </thead>
              <tbody>
                {weekRanges.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="py-3 px-4 font-medium text-gray-900">{row.range}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-gray-700">{row.target}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-gray-700">{row.totalCustomer}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-gray-700">{row.newCustomer}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-gray-700">{row.repeatCustomer}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-gray-700">{row.churnCustomer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageCard>

        <PageCard accent="blue" icon="ri-calendar-line" title="Kalender (Lihat Harian)">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((d) => (
                  <div key={d} className="py-2 font-semibold text-gray-600">{d}</div>
                ))}
                {calendarDays.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => d !== null && setSelectedDate(d)}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      d === null
                        ? 'invisible'
                        : selectedDate === d
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-blue-50 text-gray-700'
                    }`}
                  >
                    {d ?? ''}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-l border-gray-200 pl-6">
              <h4 className="font-semibold text-gray-900 mb-3">Detail Harian</h4>
              {selectedDate && selectedDaily ? (
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">{selectedDate} {MONTHS[month]} {year}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="px-3 py-2 bg-gray-50 rounded-lg"><span className="text-gray-500">Target</span><span className="block font-semibold text-gray-900">{selectedDaily.target}</span></div>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg"><span className="text-gray-500">Total</span><span className="block font-semibold text-gray-900">{selectedDaily.total}</span></div>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg"><span className="text-gray-500">New</span><span className="block font-semibold text-green-700">{selectedDaily.new}</span></div>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg"><span className="text-gray-500">Repeat</span><span className="block font-semibold text-blue-700">{selectedDaily.repeat}</span></div>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg col-span-2"><span className="text-gray-500">Churn</span><span className="block font-semibold text-amber-700">{selectedDaily.churn}</span></div>
                  </div>
                </div>
              ) : selectedDate ? (
                <p className="text-gray-500 text-sm">Belum ada data untuk tanggal ini.</p>
              ) : (
                <p className="text-gray-500 text-sm">Klik tanggal di kalender untuk lihat detail harian.</p>
              )}
            </div>
          </div>
        </PageCard>
      </div>
    </DashboardLayout>
  );
}
