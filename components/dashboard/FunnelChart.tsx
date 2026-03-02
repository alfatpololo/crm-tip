'use client';

import Link from 'next/link';

const defaultStages = [
  { name: 'Lead', count: 1250, percentage: 100, color: 'bg-blue-500' },
  { name: 'Demo', count: 625, percentage: 50, color: 'bg-blue-600' },
  { name: 'Proposal', count: 375, percentage: 30, color: 'bg-blue-700' },
  { name: 'Closing', count: 310, percentage: 24.8, color: 'bg-blue-800' },
];

export default function FunnelChart({ embedded }: { embedded?: boolean }) {
  const stages = defaultStages;

  const content = (
    <div className="space-y-4">
      {!embedded && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Corong Konversi</h3>
          <Link href="/analytics/funnel" className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap">
            Lihat Detail
          </Link>
        </div>
      )}
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{stage.name}</span>
              <span className="text-sm font-semibold text-gray-900">{stage.count} leads</span>
            </div>
            <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
              <div 
                className={`h-full ${stage.color} flex items-center justify-end px-4 transition-all duration-500`}
                style={{ width: `${stage.percentage}%` }}
              >
                <span className="text-white font-semibold text-sm">{stage.percentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      {content}
    </div>
  );
}