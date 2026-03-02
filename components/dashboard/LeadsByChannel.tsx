'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LeadsByChannel() {
  const data = [
    { channel: 'IG', leads: 145 },
    { channel: 'WA', leads: 98 },
    { channel: 'Facebook', leads: 76 },
    { channel: 'Email', leads: 54 },
  ];

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Leads per Saluran</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap cursor-pointer">
          Lihat Semua
        </button>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="channel" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: 'none', 
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Bar dataKey="leads" fill="#3B82F6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}