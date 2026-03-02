'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { month: 'Jan', revenue: 85000000 },
  { month: 'Feb', revenue: 92000000 },
  { month: 'Mar', revenue: 98000000 },
  { month: 'Apr', revenue: 105000000 },
  { month: 'Mei', revenue: 118000000 },
  { month: 'Jun', revenue: 125000000 },
];

export default function RevenueChart({ embedded }: { embedded?: boolean }) {
  const chart = (
    <>
      {!embedded && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Pertumbuhan Pendapatan Bulanan</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">MRR:</span>
            <span className="text-lg font-bold text-gray-900">Rp 125Jt</span>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded whitespace-nowrap">+18.7%</span>
          </div>
        </div>
      )}
      <ResponsiveContainer width="100%" height={embedded ? 280 : 240}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} tickFormatter={(v) => `${(v/1000000).toFixed(0)}Jt`} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: 'none', 
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number) => [`Rp ${(value / 1000000).toFixed(0)}Jt`, 'Pendapatan']}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3B82F6" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );

  if (embedded) {
    return chart;
  }
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      {chart}
    </div>
  );
}