'use client';

import { useState, useEffect, useCallback } from 'react';

export type ActivityOption = {
  value: string;
  sectionLabel: string;
  activityLabel: string;
  satuan: string;
};

export type LaporanPekerjaan = {
  id: string;
  tanggal: string;
  pic: string;
  product?: string;
  tipeAktivitas: string;
  activityLabel: string;
  sectionLabel: string;
  satuan: string;
  realisasi: number;
  catatan: string;
  createdAt: string;
};

export const LAPORAN_STORAGE_KEY = 'crm-tip-laporan-pekerjaan';

export type ProductOption = { value: string; label: string };

type Props = {
  activityOptions: ActivityOption[];
  teamMembers: string[];
  products?: ProductOption[];
  onLaporanChange?: (laporan: LaporanPekerjaan[]) => void;
};

export default function InputLaporanPekerjaan({ activityOptions, teamMembers, products = [], onLaporanChange }: Props) {
  const [laporanList, setLaporanList] = useState<LaporanPekerjaan[]>([]);
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().slice(0, 10),
    pic: '',
    product: '',
    tipeAktivitas: '',
    realisasi: '',
    catatan: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [filterSection, setFilterSection] = useState<string>('');

  const loadLaporan = useCallback(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(LAPORAN_STORAGE_KEY) : null;
      const list: LaporanPekerjaan[] = raw ? JSON.parse(raw) : [];
      setLaporanList(list);
      onLaporanChange?.(list);
    } catch {
      setLaporanList([]);
    }
  }, [onLaporanChange]);

  useEffect(() => {
    loadLaporan();
  }, [loadLaporan]);

  const saveLaporan = (list: LaporanPekerjaan[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LAPORAN_STORAGE_KEY, JSON.stringify(list));
    }
    setLaporanList(list);
    onLaporanChange?.(list);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pic || !form.tipeAktivitas || form.realisasi === '' || Number(form.realisasi) < 0) return;
    const opt = activityOptions.find((o) => o.value === form.tipeAktivitas);
    if (!opt) return;
    const newLaporan: LaporanPekerjaan = {
      id: `lp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      tanggal: form.tanggal,
      pic: form.pic,
      product: form.product || undefined,
      tipeAktivitas: form.tipeAktivitas,
      activityLabel: opt.activityLabel,
      sectionLabel: opt.sectionLabel,
      satuan: opt.satuan,
      realisasi: Number(form.realisasi),
      catatan: form.catatan.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = [newLaporan, ...laporanList];
    saveLaporan(next);
    setForm({
      tanggal: new Date().toISOString().slice(0, 10),
      pic: form.pic,
      product: form.product,
      tipeAktivitas: '',
      realisasi: '',
      catatan: '',
    });
    setShowForm(false);
    // Tetap tampilkan tabel di bawah agar entri baru terlihat
    setTimeout(() => {
      const tableEl = document.querySelector('[data-laporan-table]');
      tableEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleHapus = (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm('Hapus laporan ini?')) return;
    saveLaporan(laporanList.filter((l) => l.id !== id));
  };

  const sections = Array.from(new Set(activityOptions.map((o) => o.sectionLabel))).sort();
  const filteredOptions = filterSection
    ? activityOptions.filter((o) => o.sectionLabel === filterSection)
    : activityOptions;
  const filteredLaporan = filterSection
    ? laporanList.filter((l) => l.sectionLabel === filterSection)
    : laporanList;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden border-l-4 border-l-blue-500">
        <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-5 border-b border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <i className="ri-file-edit-line text-2xl text-blue-600"></i>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Input Laporan Pekerjaan</h2>
                <p className="text-sm text-gray-600 mt-0.5">Tim dapat menginput laporan sesuai tipe aktivitas dan realisasi</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-2"
            >
              <i className="ri-add-line text-lg"></i>
              {showForm ? 'Tutup Form' : 'Tambah Laporan'}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal</label>
                <input
                  type="date"
                  required
                  value={form.tanggal}
                  onChange={(e) => setForm((f) => ({ ...f, tanggal: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">PIC</label>
                <select
                  required
                  value={form.pic}
                  onChange={(e) => setForm((f) => ({ ...f, pic: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Pilih PIC</option>
                  {teamMembers.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              {products.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Produk</label>
                  <select
                    value={form.product}
                    onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Pilih produk (opsional)</option>
                    {products.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipe Aktivitas</label>
                <div className="flex gap-2">
                  <select
                    value={filterSection}
                    onChange={(e) => {
                      setFilterSection(e.target.value);
                      setForm((f) => ({ ...f, tipeAktivitas: '' }));
                    }}
                    className="w-40 flex-shrink-0 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Semua section</option>
                    {sections.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <select
                    required
                    value={form.tipeAktivitas}
                    onChange={(e) => setForm((f) => ({ ...f, tipeAktivitas: e.target.value }))}
                    className="flex-1 min-w-0 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Pilih kegiatan</option>
                    {filteredOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.sectionLabel} — {opt.activityLabel} ({opt.satuan})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Realisasi</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  required
                  value={form.realisasi}
                  onChange={(e) => setForm((f) => ({ ...f, realisasi: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Angka pencapaian"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Catatan (opsional)</label>
                <input
                  type="text"
                  value={form.catatan}
                  onChange={(e) => setForm((f) => ({ ...f, catatan: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Keterangan tambahan"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-2"
              >
                <i className="ri-check-line"></i> Simpan Laporan
              </button>
            </div>
          </form>
        )}

        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Filter section:</span>
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Semua</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">({filteredLaporan.length} laporan)</span>
        </div>

        <div className="overflow-x-auto" data-laporan-table>
          <p className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
            Laporan yang Anda tambah akan muncul di tabel di bawah. Realisasi di tabel kegiatan (I–IV) juga ter-update dari jumlah laporan per kegiatan.
          </p>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">PIC</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Produk</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Section</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kegiatan</th>
                <th className="text-right py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Realisasi</th>
                <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Catatan</th>
                <th className="text-center py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLaporan.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500 text-sm">
                    Belum ada laporan. Klik &quot;Tambah Laporan&quot; untuk menginput.
                  </td>
                </tr>
              ) : (
                filteredLaporan.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-5 text-sm text-gray-900">{new Date(l.tanggal).toLocaleDateString('id-ID')}</td>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800">
                        {l.pic}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-sm text-gray-700">{l.product || '–'}</td>
                    <td className="py-3.5 px-5 text-sm text-gray-600">{l.sectionLabel}</td>
                    <td className="py-3.5 px-5 text-sm text-gray-800 max-w-[200px] truncate" title={l.activityLabel}>
                      {l.activityLabel}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="font-semibold text-gray-900 tabular-nums">{l.realisasi}</span>
                      <span className="text-gray-500 text-sm ml-1">{l.satuan}</span>
                    </td>
                    <td className="py-3.5 px-5 text-sm text-gray-500 max-w-[160px] truncate" title={l.catatan}>
                      {l.catatan || '–'}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <button
                        type="button"
                        onClick={() => handleHapus(l.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Hapus"
                      >
                        <i className="ri-delete-bin-line w-5 h-5"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
