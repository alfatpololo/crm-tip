'use client';

import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';

const DUMMY_VOC = [
  {
    id: '1',
    tanggalComplain: '2025-02-15',
    channel: 'WhatsApp',
    noTelpUsername: '08123456789',
    namaUsaha: 'Toko Sumber Jaya',
    detailComplain: 'Aplikasi sering error saat input stok',
    kategori: 'Complain',
    temuanMasalah: 'Bug pada modul inventory',
    tindakLanjut: 'Tim dev sudah deploy patch, monitoring 3 hari',
    pic: 'Nina',
    solved: true,
  },
  {
    id: '2',
    tanggalComplain: '2025-02-18',
    channel: 'Instagram DM',
    noTelpUsername: '@warung_halal',
    namaUsaha: 'Warung Halal',
    detailComplain: 'Tanya cara upgrade paket Disiplinku',
    kategori: 'Informasi',
    temuanMasalah: '-',
    tindakLanjut: 'Dikirim brosur dan link pendaftaran',
    pic: 'Roby',
    solved: true,
  },
  {
    id: '3',
    tanggalComplain: '2025-02-22',
    channel: 'Email',
    noTelpUsername: 'budi@resto.co.id',
    namaUsaha: 'Resto Nusantara',
    detailComplain: 'Invoice tertunda 2 minggu, minta penjelasan',
    kategori: 'Complain',
    temuanMasalah: 'Keterlambatan bagian finance',
    tindakLanjut: 'Invoice sudah dikirim, follow up ke finance',
    pic: 'Ilham',
    solved: false,
  },
  {
    id: '4',
    tanggalComplain: '2025-02-25',
    channel: 'TikTok DM',
    noTelpUsername: '@cafe_kenangan',
    namaUsaha: 'Cafe Kenangan',
    detailComplain: 'Request fitur laporan harian otomatis',
    kategori: 'Lain-lain',
    temuanMasalah: 'Fitur belum tersedia di paket saat ini',
    tindakLanjut: 'Disampaikan ke product untuk roadmap',
    pic: 'Radi',
    solved: false,
  },
];

function formatDate(s: string) {
  try {
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return s;
  }
}

export default function VoiceOfCustomerPage() {
  const headers = ['Tanggal Complain', 'Channel', 'No. Telp/Username', 'Nama Usaha', 'Detail Complain', 'Kategori', 'Temuan Masalah', 'Tindak Lanjut', 'PIC', 'Solved/Unsolved'];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero title="Voice of Customer" subtitle="Data complain dan feedback dari customer." badge={{ icon: 'ri-customer-service-line', text: 'VOC' }} variant="rose" />
        <PageCard accent="rose" icon="ri-file-list-3-line" title="Tabel Voice of Customer">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {headers.map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {DUMMY_VOC.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3 text-gray-700">{formatDate(row.tanggalComplain)}</td>
                    <td className="px-4 py-3 text-gray-700">{row.channel}</td>
                    <td className="px-4 py-3 text-gray-700">{row.noTelpUsername}</td>
                    <td className="px-4 py-3 text-gray-700">{row.namaUsaha}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs">{row.detailComplain}</td>
                    <td className="px-4 py-3 text-gray-700">{row.kategori}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs">{row.temuanMasalah}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs">{row.tindakLanjut}</td>
                    <td className="px-4 py-3 text-gray-700">{row.pic}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${row.solved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {row.solved ? 'Solved' : 'Unsolved'}
                      </span>
                    </td>
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
