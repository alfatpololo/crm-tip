'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import DashboardLayout from '@/components/DashboardLayout';
import PageHero from '@/components/ui/PageHero';
import PageCard from '@/components/ui/PageCard';
import { useTeamMembers, teamMemberDisplay } from '@/lib/useTeamAndProducts';
import { useProducts } from '@/lib/useTeamAndProducts';
import { supabase } from '@/lib/supabase/client';

const STATUS_OPTIONS = [
  { value: 'concept', label: 'Concept' },
  { value: 'scripting', label: 'Scripting' },
  { value: 'editing', label: 'Editing' },
  { value: 'revisi', label: 'Revisi' },
  { value: 'posting', label: 'Posting' },
];

const GOALS_OPTIONS = [
  { value: 'awareness', label: 'Awareness' },
  { value: 'consideration', label: 'Consideration' },
  { value: 'conversion', label: 'Conversion' },
];

const PILLAR_OPTIONS = [
  { value: 'edukasi', label: 'Edukasi' },
  { value: 'entertaint', label: 'Entertaint' },
  { value: 'fitur', label: 'Fitur' },
  { value: 'testimoni', label: 'Testimoni' },
  { value: 'promosi', label: 'Promosi' },
];

const TYPE_OPTIONS = [
  { value: 'feed', label: 'Feed' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'reels', label: 'Reels' },
  { value: 'story', label: 'Story' },
];

export type ContentPlanEntry = {
  id: string;
  namaAplikasi: string;
  rencanaPosting: string;
  status: string;
  pic: string;
  topic: string;
  goalsContent: string;
  contentPillar: string;
  typeOfContent: string;
  referenceFileName?: string;
  link: string;
  caption: string;
  revisi: string;
  accToPosting: boolean;
  createdAt: string;
};

const defaultForm = (): Omit<ContentPlanEntry, 'id' | 'createdAt'> => ({
  namaAplikasi: '',
  rencanaPosting: new Date().toISOString().slice(0, 10),
  status: 'concept',
  pic: '',
  topic: '',
  goalsContent: 'awareness',
  contentPillar: 'edukasi',
  typeOfContent: 'feed',
  link: '',
  caption: '',
  revisi: '',
  accToPosting: false,
});

export default function ContentPlannerPage() {
  const router = useRouter();
  const { users } = useTeamMembers();
  const { products } = useProducts();
  const [plans, setPlans] = useState<ContentPlanEntry[]>([]);
  const [form, setForm] = useState(defaultForm());
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);

  const exportToExcel = useCallback(() => {
    if (plans.length === 0) return;
    setExporting(true);
    try {
      const headers = ['No', 'Tanggal', 'Aplikasi', 'Status', 'PIC', 'Topic', 'Goals', 'Pillar', 'Type', 'Link', 'Caption', 'Revisi', 'Acc to Posting'];
      const rows = plans.map((p, i) => [
        i + 1,
        p.rencanaPosting,
        p.namaAplikasi,
        p.status,
        p.pic,
        p.topic ?? '',
        p.goalsContent ?? '',
        p.contentPillar ?? '',
        p.typeOfContent ?? '',
        p.link ?? '',
        (p.caption ?? '').slice(0, 200),
        p.revisi ?? '',
        p.accToPosting ? 'Ya' : 'Tidak',
      ]);
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Content Planner');
      XLSX.writeFile(wb, `content-planner-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } finally {
      setExporting(false);
    }
  }, [plans]);

  const handleImportExcel = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
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
        if (idx('Aplikasi') < 0 || idx('PIC') < 0) {
          setError('Kolom wajib: Aplikasi, PIC. Gunakan file hasil Export.');
          return;
        }
        const plansToImport = rows.slice(1).map((row) => {
          const get = (i: number) => (row[i] != null ? String(row[i]).trim() : '');
          return {
            namaAplikasi: get(idx('Aplikasi')),
            rencanaPosting: get(idx('Tanggal')) || new Date().toISOString().slice(0, 10),
            status: get(idx('Status')) || 'concept',
            pic: get(idx('PIC')),
            topic: get(idx('Topic')),
            goalsContent: get(idx('Goals')) || 'awareness',
            contentPillar: get(idx('Pillar')) || 'edukasi',
            typeOfContent: get(idx('Type')) || 'feed',
            link: get(idx('Link')),
            caption: get(idx('Caption')),
            revisi: get(idx('Revisi')),
            accToPosting: (get(idx('Acc to Posting')) || '').toLowerCase() === 'ya',
          };
        }).filter((p) => p.namaAplikasi && p.pic);

        if (plansToImport.length === 0) {
          setError('Tidak ada baris valid. Aplikasi dan PIC wajib.');
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const res = await fetch('/api/content-planner/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ plans: plansToImport }),
        });
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || 'Gagal import');
          return;
        }
        fetchPlans();
      } catch {
        setError('Gagal memproses file. Pastikan format .xlsx.');
      } finally {
        setImporting(false);
      }
    },
    [fetchPlans]
  );

  const productOptions = useMemo(() => (products.length > 0 ? products : [{ key: 'mkasir', name: 'MKASIR' }, { key: 'disiplinku', name: 'DISIPLINKU' }]), [products]);
  const picOptions = useMemo(() => {
    if (users.length > 0) return users.map((u) => ({ value: u.email, label: teamMemberDisplay(u) }));
    return ['Alfath', 'Nina', 'Ilham', 'Roby', 'Radi', 'Jemi'].map((name) => ({ value: name, label: name }));
  }, [users]);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/content-planner', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      const json = await res.json();
      if (res.ok && Array.isArray(json.plans)) {
        setPlans(json.plans);
      } else {
        setPlans([]);
        if (json.error) setError(json.error);
      }
    } catch {
      setPlans([]);
      setError('Gagal memuat data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.namaAplikasi || !form.pic) return;
    setSubmitLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/content-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          namaAplikasi: form.namaAplikasi,
          rencanaPosting: form.rencanaPosting,
          status: form.status,
          pic: form.pic,
          topic: form.topic,
          goalsContent: form.goalsContent,
          contentPillar: form.contentPillar,
          typeOfContent: form.typeOfContent,
          referenceFileName: form.referenceFileName,
          link: form.link,
          caption: form.caption,
          revisi: form.revisi,
          accToPosting: form.accToPosting,
        }),
      });
      const json = await res.json();
      if (res.ok && json.item) {
        setPlans((prev) => [json.item, ...prev]);
        setForm(defaultForm());
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
          title="Content Planner"
          subtitle="Rencana posting, status, PIC, topic, goals content, pillar, type of content."
          badge={{ icon: 'ri-calendar-event-line', text: 'Planner' }}
          variant="amber"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PageCard accent="amber" icon="ri-add-circle-line" title="Tambah Rencana">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Aplikasi</label>
                  <select
                    value={form.namaAplikasi}
                    onChange={(e) => setForm((f) => ({ ...f, namaAplikasi: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Pilih</option>
                    {productOptions.map((p) => (
                      <option key={p.key} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rencana Posting</label>
                  <input
                    type="date"
                    value={form.rencanaPosting}
                    onChange={(e) => setForm((f) => ({ ...f, rencanaPosting: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PIC</label>
                  <select
                    value={form.pic}
                    onChange={(e) => setForm((f) => ({ ...f, pic: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Pilih PIC</option>
                    {picOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={form.topic}
                    onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="Topic konten"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goals Content</label>
                  <select
                    value={form.goalsContent}
                    onChange={(e) => setForm((f) => ({ ...f, goalsContent: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    {GOALS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content Pillar</label>
                  <select
                    value={form.contentPillar}
                    onChange={(e) => setForm((f) => ({ ...f, contentPillar: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    {PILLAR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type of Content</label>
                  <select
                    value={form.typeOfContent}
                    onChange={(e) => setForm((f) => ({ ...f, typeOfContent: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    {TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                  <input
                    type="url"
                    value={form.link}
                    onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="https://"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                  <textarea
                    value={form.caption}
                    onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="Caption"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Revisi</label>
                  <textarea
                    value={form.revisi}
                    onChange={(e) => setForm((f) => ({ ...f, revisi: e.target.value }))}
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="Catatan revisi"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="accToPosting"
                    checked={form.accToPosting}
                    onChange={(e) => setForm((f) => ({ ...f, accToPosting: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="accToPosting" className="text-sm font-medium text-gray-700">Acc to Posting</label>
                </div>
                <button type="submit" disabled={submitLoading} className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2">
                  {submitLoading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin text-lg"></i>
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Rencana'
                  )}
                </button>
              </form>
            </PageCard>
          </div>

          <div className="lg:col-span-2">
            <PageCard accent="slate" icon="ri-calendar-check-line" title="Daftar Rencana Posting">
              <div className="flex flex-wrap items-center justify-end gap-2 mb-4">
                <input
                  ref={importFileRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleImportExcel}
                />
                <button
                  type="button"
                  onClick={() => importFileRef.current?.click()}
                  disabled={importing}
                  className="px-4 py-2 border border-amber-500 text-amber-700 hover:bg-amber-50 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {importing ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-file-upload-line"></i>}
                  Import dari Excel
                </button>
                <button
                  type="button"
                  onClick={exportToExcel}
                  disabled={exporting || plans.length === 0}
                  className="px-4 py-2 border border-amber-500 text-amber-700 hover:bg-amber-50 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {exporting ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-file-excel-2-line"></i>}
                  Export ke Excel
                </button>
              </div>
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="py-12 flex justify-center">
                    <i className="ri-loader-4-line animate-spin text-3xl text-amber-600"></i>
                  </div>
                ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left py-2 px-2 font-medium text-gray-600">Tanggal</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-600">Aplikasi</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-600">Status</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-600">PIC</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-600">Topic</th>
                      <th className="text-left py-2 px-2 font-medium text-gray-600">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">Belum ada rencana. Isi form di kiri.</td>
                      </tr>
                    ) : (
                      plans.map((p) => (
                        <tr
                          key={p.id}
                          onClick={() => router.push(`/execution/content-planner/${p.id}`)}
                          className="border-t border-gray-100 hover:bg-amber-50/80 cursor-pointer"
                        >
                          <td className="py-2 px-2 text-gray-700">{p.rencanaPosting}</td>
                          <td className="py-2 px-2 font-medium text-gray-900">{p.namaAplikasi}</td>
                          <td className="py-2 px-2"><span className="capitalize">{p.status}</span></td>
                          <td className="py-2 px-2 text-gray-700">{picOptions.find((o) => o.value === p.pic)?.label ?? p.pic?.split('@')[0] ?? p.pic}</td>
                          <td className="py-2 px-2 text-gray-700 line-clamp-1">{p.topic || '–'}</td>
                          <td className="py-2 px-2 text-gray-600">{p.typeOfContent}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                )}
              </div>
            </PageCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
