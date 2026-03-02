/**
 * Data leads satu sumber — mengikuti aktivitas marketing:
 * PIC: Alfath, Nina, Ilham, Roby, Radi, Jemi
 * Produk (untuk aktivitas): 2 produk — MKASIR & DISIPLINKU.
 * Di pipeline/leads dipakai varian: MKASIR Retail, MKASIR F&B, MKASIR Persewaan, DISIPLINKU, Salespoint.
 * Sumber: IG, WA, Facebook, Email
 */

export const PIC_OPTIONS = ['Alfath', 'Nina', 'Ilham', 'Roby', 'Radi', 'Jemi'] as const;
export const PRODUCT_OPTIONS = ['MKASIR Retail', 'MKASIR F&B', 'MKASIR Persewaan', 'DISIPLINKU', 'Salespoint'] as const;
export const SOURCE_OPTIONS = ['IG', 'WA', 'Facebook', 'Email'] as const;
export const STAGE_OPTIONS = ['Lead', 'Dihubungi', 'Demo', 'Proposal', 'Negosiasi', 'Closing'] as const;

export type LeadRecord = {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  product: string;
  stage: string;
  value: number;
  pic: string;
  createdAt: string;
  notes: string;
  status?: 'baru' | 'aktif' | 'panas';
};

/** Data lengkap lead untuk tabel, detail, dan pipeline — satu sumber kebenaran */
export const LEADS_DATA: LeadRecord[] = [
  { id: 1, name: 'Budi Santoso', company: 'Toko Maju Jaya', email: 'budi@tokomajujaya.com', phone: '+62 812-3456-7890', source: 'IG', product: 'MKASIR Retail', stage: 'Demo', value: 12500000, pic: 'Ilham', createdAt: '2024-01-10', notes: 'Minat kuat setelah demo. Follow-up minggu depan.', status: 'aktif' },
  { id: 2, name: 'Siti Rahayu', company: 'Warung Sejahtera Depok', email: 'siti@warungsejahtera.com', phone: '+62 821-9876-5432', source: 'WA', product: 'MKASIR F&B', stage: 'Proposal', value: 8500000, pic: 'Robby', createdAt: '2024-01-08', notes: 'Proposal dikirim 14 Jan. Menunggu respons.', status: 'aktif' },
  { id: 3, name: 'Ahmad Fauzi', company: 'RM Sederhana', email: 'ahmad@rmsederhana.com', phone: '+62 811-2233-4455', source: 'Facebook', product: 'MKASIR Retail', stage: 'Negosiasi', value: 15000000, pic: 'Nina', createdAt: '2024-01-05', notes: 'Negosiasi harga dan scope. Meeting lanjutan 20 Jan.', status: 'panas' },
  { id: 4, name: 'Dewi Lestari', company: 'Minimarket Citra', email: 'dewi@minimarketcitra.com', phone: '+62 813-5566-7788', source: 'Email', product: 'MKASIR F&B', stage: 'Dihubungi', value: 4500000, pic: 'Radi', createdAt: '2024-01-12', notes: 'First call selesai. Jadwalkan demo.', status: 'aktif' },
  { id: 5, name: 'Rudi Hartono', company: 'Kafe 99', email: 'rudi@kafe99.com', phone: '+62 818-9988-7766', source: 'IG', product: 'Salespoint', stage: 'Demo', value: 20000000, pic: 'Jemi', createdAt: '2024-01-03', notes: 'Demo berjalan baik. Minat tinggi.', status: 'aktif' },
  { id: 6, name: 'Fitri Handayani', company: 'Toko Elektronik Jaya', email: 'fitri@tokoelektronik.com', phone: '+62 817-6655-4433', source: 'WA', product: 'MKASIR Persewaan', stage: 'Lead', value: 7500000, pic: 'Jemi', createdAt: '2024-01-04', notes: 'Lead dari WA. Perlu follow-up.', status: 'baru' },
  { id: 7, name: 'Agus Prasetyo', company: 'Grosir Serba Ada', email: 'agus@grosirserbaada.com', phone: '+62 815-3344-2211', source: 'Facebook', product: 'DISIPLINKU', stage: 'Closing', value: 18000000, pic: 'Radi', createdAt: '2024-01-06', notes: 'Deal dari pipeline Demo.', status: 'panas' },
  { id: 8, name: 'Maya Kusuma', company: 'Bengkel Mandiri', email: 'maya@bengkelmandiri.com', phone: '+62 812-9988-7766', source: 'Email', product: 'MKASIR Retail', stage: 'Proposal', value: 18000000, pic: 'Nina', createdAt: '2024-01-07', notes: 'Proposal dikirim. Menunggu approval.', status: 'aktif' },
  { id: 9, name: 'Bambang Wijaya', company: 'Toko Sumber Rezeki', email: 'bambang@tokosumberrezeki.com', phone: '+62 819-8877-6655', source: 'IG', product: 'MKASIR Retail', stage: 'Negosiasi', value: 16500000, pic: 'Ilham', createdAt: '2024-01-02', notes: 'Negosiasi diskon. Follow-up besok.', status: 'aktif' },
  { id: 10, name: 'Linda Kusuma', company: 'Kantor HR Depok', email: 'linda@kantorhr.com', phone: '+62 818-7766-5544', source: 'WA', product: 'Salespoint', stage: 'Closing', value: 22000000, pic: 'Robby', createdAt: '2023-12-20', notes: 'Deal dari pipeline Closing.', status: 'panas' },
];

/** Map id → lead untuk halaman detail */
export const getLeadById = (id: string): LeadRecord | undefined => {
  const num = parseInt(id, 10);
  return LEADS_DATA.find((l) => l.id === num);
};

/** Untuk pipeline: group by stage, return deals dengan id, company, value, product, pic (inisial) */
const picToInitial: Record<string, string> = { Alfath: 'AF', Nina: 'NA', Ilham: 'IH', Roby: 'RB', Radi: 'RD', Jemi: 'JM' };
export function getPipelineDealsByStage() {
  const stages = ['Lead', 'Dihubungi', 'Demo', 'Proposal', 'Negosiasi', 'Closing', 'Gagal'] as const;
  return stages.map((stageName) => {
    const deals = LEADS_DATA.filter((l) => l.stage === stageName).map((l) => ({
      id: l.id,
      company: l.company,
      value: l.value,
      product: l.product,
      pic: picToInitial[l.pic] || l.pic.slice(0, 2).toUpperCase(),
      days: Math.min(30, Math.floor((Date.now() - new Date(l.createdAt).getTime()) / 86400000)),
    }));
    const count = deals.length;
    const value = deals.reduce((s, d) => s + d.value, 0);
    const color =
      stageName === 'Lead' ? 'bg-gray-100' :
      stageName === 'Dihubungi' ? 'bg-blue-100' :
      stageName === 'Demo' ? 'bg-purple-100' :
      stageName === 'Proposal' ? 'bg-yellow-100' :
      stageName === 'Negosiasi' ? 'bg-orange-100' :
      stageName === 'Closing' ? 'bg-green-100' : 'bg-red-100';
    return { name: stageName, count, value, color, deals };
  });
}
