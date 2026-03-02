import Link from 'next/link';
import { LEADS_DATA } from '@/lib/leadsData';

const productSlug: Record<string, string> = {
  'mkasir-retail': 'MKASIR Retail',
  'mkasir-fnb': 'MKASIR F&B',
  'mkasir-persewaan': 'MKASIR Persewaan',
  disiplinku: 'DISIPLINKU',
  salespoint: 'Salespoint',
};
const sourceSlug: Record<string, string> = { ig: 'IG', wa: 'WA', facebook: 'Facebook', email: 'Email' };
const stageSlug: Record<string, string> = {
  lead: 'Lead',
  contacted: 'Dihubungi',
  demo: 'Demo',
  proposal: 'Proposal',
  negotiation: 'Negosiasi',
  closing: 'Closing',
};

export default function LeadsTable({ filters }: { filters: any }) {
  const filtered = LEADS_DATA.filter((lead) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!lead.name.toLowerCase().includes(q) && !lead.company.toLowerCase().includes(q) && !lead.email.toLowerCase().includes(q)) return false;
    }
    if (filters.product && filters.product !== 'all') {
      if (productSlug[filters.product] !== lead.product) return false;
    }
    if (filters.channel && filters.channel !== 'all') {
      if (sourceSlug[filters.channel] !== lead.source) return false;
    }
    if (filters.stage && filters.stage !== 'all') {
      if (stageSlug[filters.stage] !== lead.stage) return false;
    }
    if (filters.pic && filters.pic !== 'all') {
      const picName = filters.pic.charAt(0).toUpperCase() + filters.pic.slice(1);
      if (picName !== lead.pic) return false;
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'panas': return 'bg-red-100 text-red-700';
      case 'baru': return 'bg-green-100 text-green-700';
      case 'aktif': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Lead': return 'bg-gray-100 text-gray-700';
      case 'Dihubungi': return 'bg-blue-100 text-blue-700';
      case 'Demo': return 'bg-purple-100 text-purple-700';
      case 'Proposal': return 'bg-yellow-100 text-yellow-700';
      case 'Negosiasi': return 'bg-orange-100 text-orange-700';
      case 'Closing': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatRupiah = (value: number) => {
    if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(1)}M`;
    return `Rp ${(value / 1000000).toFixed(0)}Jt`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Nama</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Perusahaan</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Sumber</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Produk</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Tahap</th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Nilai Deal</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">PIC</th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Status</th>
            <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((lead) => (
            <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-4 px-4">
                <div className="font-medium text-gray-900 whitespace-nowrap">{lead.name}</div>
                <div className="text-xs text-gray-500 whitespace-nowrap">{lead.createdAt}</div>
              </td>
              <td className="py-4 px-4 text-gray-900 whitespace-nowrap">{lead.company}</td>
              <td className="py-4 px-4">
                <span className="inline-flex items-center gap-1 text-sm text-gray-700 whitespace-nowrap">
                  <i className="ri-share-line w-4 h-4 flex items-center justify-center"></i>
                  {lead.source}
                </span>
              </td>
              <td className="py-4 px-4 text-gray-900 text-sm whitespace-nowrap">{lead.product}</td>
              <td className="py-4 px-4">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStageColor(lead.stage)}`}>
                  {lead.stage}
                </span>
              </td>
              <td className="py-4 px-4 text-right font-semibold text-gray-900 whitespace-nowrap">{formatRupiah(lead.value)}</td>
              <td className="py-4 px-4 text-gray-900 text-sm whitespace-nowrap">{lead.pic}</td>
              <td className="py-4 px-4">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase whitespace-nowrap ${getStatusColor(lead.status || 'aktif')}`}>
                  {lead.status || 'aktif'}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-center gap-2">
                  <Link href={`/crm/lead-details/${lead.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Lihat detail">
                    <i className="ri-eye-line w-5 h-5 flex items-center justify-center"></i>
                  </Link>
                  <Link href={`/crm/lead-details/${lead.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors" title="Edit lead">
                    <i className="ri-edit-line w-5 h-5 flex items-center justify-center"></i>
                  </Link>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer">
                    <i className="ri-delete-bin-line w-5 h-5 flex items-center justify-center"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
