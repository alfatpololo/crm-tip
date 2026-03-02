'use client';

import Link from 'next/link';
import { getPipelineDealsByStage } from '@/lib/leadsData';

export default function PipelineBoard() {
  const stages = getPipelineDealsByStage();

  const formatRupiah = (value: number) => {
    if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}M`;
    return `Rp ${(value / 1000000).toFixed(0)}Jt`;
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {stages.map((stage, index) => (
          <div key={index} className="w-80 flex-shrink-0">
            <div className={`${stage.color} rounded-t-xl p-4 border-b-2 border-gray-300`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                <span className="w-6 h-6 rounded-full bg-white text-gray-900 text-xs font-bold flex items-center justify-center whitespace-nowrap">
                  {stage.count}
                </span>
              </div>
              {stage.value > 0 && (
                <p className="text-sm font-semibold text-gray-700">{formatRupiah(stage.value)}</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-b-xl p-3 min-h-[600px] space-y-3">
              {stage.deals.map((deal) => (
                <Link key={deal.id} href={`/crm/lead-details/${deal.id}`} className="block bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight">{deal.company}</h4>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold text-xs whitespace-nowrap flex-shrink-0 ml-2">
                      {deal.pic}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Nilai Deal</span>
                      <span className="text-sm font-bold text-gray-900 whitespace-nowrap">{formatRupiah(deal.value)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Produk</span>
                      <span className="text-xs text-gray-700 whitespace-nowrap">{deal.product}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <i className="ri-time-line w-3 h-3 flex items-center justify-center"></i>
                        {deal.days} hari di tahap ini
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {stage.deals.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Tidak ada deal di tahap ini
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
