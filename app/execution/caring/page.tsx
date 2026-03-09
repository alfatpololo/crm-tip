'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';

type CaringRecord = {
  id: string;
  picSales: string;
  namaToko: string;
  picToko?: string;
  tanggalCall: string;
  statusCall?: string;
  hasil?: string;
  nextAction?: string;
  tanggalFu?: string;
  createdAt?: string;
};

const HEADERS = ['No', 'PIC Sales', 'Nama Toko', 'PIC Toko', 'Tanggal Call', 'Status Call', 'Hasil', 'Next Action', 'Tanggal FU'] as const;

const STATUS_CALL_OPTIONS = [
  { value: '', label: 'Pilih status' },
  { value: 'Terhubung', label: 'Terhubung' },
  { value: 'Tidak terhubung', label: 'Tidak terhubung' },
];

function formatDate(s: string | undefined) {
  if (!s) return '–';
  try {
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return s ?? '–';
  }
}

export default function CaringPage() {
  const { role } = useAuth();
  const isCoordinator = role === 'koordinator' || role === 'management';
  const [list, setList] = useState<CaringRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    namaToko: '',
    picToko: '',
    tanggalCall: new Date().toISOString().slice(0, 10),
    statusCall: '',
    hasil: '',
    nextAction: '',
    tanggalFu: '',
  });
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/caring', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const json = await res.json();
      if (res.ok && Array.isArray(json.list)) {
        setList(json.list);
      } else {
        setList([]);
        if (json.error) setError(json.error);
      }
    } catch (e) {
      setList([]);
      setError('Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const exportToExcel = useCallback(() => {
    if (list.length === 0) return;
    setExporting(true);
    try {
      const headers = [...HEADERS];
      const rows = list.map((r, i) => [
        i + 1,
        r.picSales,
        r.namaToko,
        r.picToko ?? '',
        r.tanggalCall,
        r.statusCall ?? '',
        r.hasil ?? '',
        r.nextAction ?? '',
        r.tanggalFu ?? '',
      ]);
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Caring');
      XLSX.writeFile(wb, `caring-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } finally {
      setExporting(false);
    }
  }, [list]);

  const handleImportExcel = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file || isCoordinator) return;
      setImporting(true);
      setError(null);
      try {
        const data = await file.arrayBuffer();
        const wb = XLSX.read(data, { type: 'array' });
        const rows = XLSX.utils.sheet_to_json<(string | number)[]>(wb.Sheets[wb.SheetNames[0]], { header: 1 });
        if (rows.length < 2) {
          setError('File kosong atau hanya header. Minimal 1 baris data.');
          return;
        }
        const header = (rows[0] as (string | number)[]).map((h) => String(h));
        const idx = (name: string) => header.indexOf(name);
        const namaTokoIdx = idx('Nama Toko');
        const tanggalCallIdx = idx('Tanggal Call');
        if (namaTokoIdx < 0 || tanggalCallIdx < 0) {
          setError('Kolom wajib: Nama Toko, Tanggal Call. Gunakan file hasil Export.');
          return;
        }
        const items = rows.slice(1).map((row) => {
          const get = (i: number) => (row[i] != null ? String(row[i]).trim() : '');
          return {
            namaToko: get(namaTokoIdx),
            picToko: header.includes('PIC Toko') ? get(idx('PIC Toko')) : undefined,
            tanggalCall: get(tanggalCallIdx),
            statusCall: header.includes('Status Call') ? get(idx('Status Call')) : undefined,
            hasil: header.includes('Hasil') ? get(idx('Hasil')) : undefined,
            nextAction: header.includes('Next Action') ? get(idx('Next Action')) : undefined,
            tanggalFu: header.includes('Tanggal FU') ? get(idx('Tanggal FU')) : undefined,
          };
        }).filter((i) => i.namaToko && i.tanggalCall);

        if (items.length === 0) {
          setError('Tidak ada baris valid. Nama Toko dan Tanggal Call wajib.');
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const res = await fetch('/api/caring/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ items }),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || 'Gagal import');
          return;
        }
        fetchList();
      } catch {
        setError('Gagal memproses file. Pastikan format .xlsx.');
      } finally {
        setImporting(false);
      }
    },
    [isCoordinator, fetchList]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCoordinator) return;
    if (!form.namaToko.trim() || !form.tanggalCall.trim()) {
      setError('Nama Toko dan Tanggal Call wajib diisi.');
      return;
    }
    setSubmitLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/caring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          namaToko: form.namaToko.trim(),
          picToko: form.picToko.trim() || undefined,
          tanggalCall: form.tanggalCall,
          statusCall: form.statusCall.trim() || undefined,
          hasil: form.hasil.trim() || undefined,
          nextAction: form.nextAction.trim() || undefined,
          tanggalFu: form.tanggalFu.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (res.ok && json.item) {
        setList((prev) => [json.item, ...prev]);
        setForm({
          namaToko: '',
          picToko: '',
          tanggalCall: new Date().toISOString().slice(0, 10),
          statusCall: '',
          hasil: '',
          nextAction: '',
          tanggalFu: '',
        });
      } else {
        setError(json.error || 'Gagal menyimpan.');
      }
    } catch {
      setError('Gagal menyimpan.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <PageHero
          title="Caring"
          subtitle={isCoordinator ? 'Lihat hasil caring call dari seluruh PIC Sales. Data read-only.' : 'Isi hasil caring call Anda. Data akan terlihat oleh koordinator.'}
          badge={{ icon: 'ri-customer-service-2-line', text: 'Caring' }}
          variant="teal"
        />

        {!isCoordinator && (
          <PageCard accent="cyan" icon="ri-customer-service-2-line" title="Isi Hasil Caring">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.namaToko}
                    onChange={(e) => setForm((f) => ({ ...f, namaToko: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Nama toko"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIC Toko</label>
                  <input
                    type="text"
                    value={form.picToko}
                    onChange={(e) => setForm((f) => ({ ...f, picToko: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Nama PIC toko"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Call <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.tanggalCall}
                    onChange={(e) => setForm((f) => ({ ...f, tanggalCall: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Call</label>
                  <select
                    value={form.statusCall}
                    onChange={(e) => setForm((f) => ({ ...f, statusCall: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                  >
                    {STATUS_CALL_OPTIONS.map((opt) => (
                      <option key={opt.value || 'empty'} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hasil</label>
                  <textarea
                    value={form.hasil}
                    onChange={(e) => setForm((f) => ({ ...f, hasil: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Ringkasan hasil call"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Action</label>
                  <input
                    type="text"
                    value={form.nextAction}
                    onChange={(e) => setForm((f) => ({ ...f, nextAction: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Tindak lanjut"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal FU</label>
                  <input
                    type="date"
                    value={form.tanggalFu}
                    onChange={(e) => setForm((f) => ({ ...f, tanggalFu: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  {submitLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-lg"></i>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="ri-save-line text-lg"></i>
                      Simpan Hasil Caring
                    </>
                  )}
                </button>
              </div>
            </form>
          </PageCard>
        )}

        <PageCard accent="cyan" icon="ri-customer-service-2-line" title={isCoordinator ? 'Data Caring (Semua PIC)' : 'Data Caring Saya'}>
          <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
            <input
              ref={importFileRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleImportExcel}
            />
            {!isCoordinator && (
              <button
                type="button"
                onClick={() => importFileRef.current?.click()}
                disabled={importing}
                className="px-4 py-2 border border-cyan-500 text-cyan-700 hover:bg-cyan-50 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                {importing ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-file-upload-line"></i>}
                Import dari Excel
              </button>
            )}
            <button
              type="button"
              onClick={exportToExcel}
              disabled={exporting || list.length === 0}
              className="px-4 py-2 border border-cyan-500 text-cyan-700 hover:bg-cyan-50 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {exporting ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-file-excel-2-line"></i>}
              Export ke Excel
            </button>
          </div>
          {loading ? (
            <div className="py-12 flex justify-center">
              <i className="ri-loader-4-line animate-spin text-3xl text-teal-600"></i>
            </div>
          ) : list.length === 0 ? (
            <p className="text-gray-500 py-8 text-center">
              {isCoordinator ? 'Belum ada data caring.' : 'Belum ada data caring dari Anda. Isi form di atas untuk menambah.'}
            </p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {HEADERS.map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {list.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-gray-50/80">
                      <td className="px-4 py-3 text-sm text-gray-700">{idx + 1}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">{row.picSales}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{row.namaToko}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.picToko || '–'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(row.tanggalCall)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.statusCall || '–'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate" title={row.hasil}>{row.hasil || '–'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate" title={row.nextAction}>{row.nextAction || '–'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(row.tanggalFu)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PageCard>
      </div>
    </DashboardLayout>
  );
}
