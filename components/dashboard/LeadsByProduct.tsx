'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function LeadsByProduct() {
  const data = [
    { name: 'MKASIR Retail', value: 142, color: '#1E40AF' },
    { name: 'MKASIR F&B', value: 72, color: '#3B82F6' },
    { name: 'MKASIR Persewaan', value: 45, color: '#60A5FA' },
    { name: 'DISIPLINKU', value: 98, color: '#2563EB' },
    { name: 'Salespoint', value: 35, color: '#93C5FD' },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Leads per Produk</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap cursor-pointer">
          Lihat Semua
        </button>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: 'none', 
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry: any) => `${value} (${entry.payload.value})`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}